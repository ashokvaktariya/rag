#!/usr/bin/env python3
"""
Complete ETL Pipeline: Zoho CRM to PostgreSQL
Single file that handles:
- Fetching data from Zoho CRM
- Updating PostgreSQL database
- Scheduled sync every 24 hours
- Error handling and logging
"""

import asyncio
import json
import logging
import os
import psycopg2
import requests
import schedule
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import openai

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('etl/etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ZohoETLPipeline:
    """Complete ETL pipeline for Zoho CRM to PostgreSQL"""
    
    def __init__(self):
        # Zoho configuration
        self.client_id = os.getenv("ZOHO_CLIENT_ID")
        self.client_secret = os.getenv("ZOHO_CLIENT_SECRET")
        self.redirect_uri = os.getenv("ZOHO_REDIRECT_URI")
        self.refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")
        self.accounts_url = os.getenv("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.com")
        self.crm_api_url = os.getenv("ZOHO_CRM_API_URL", "https://www.zohoapis.com/crm/v2")
        
        # PostgreSQL configuration
        self.postgres_url = os.getenv("POSTGRES_URL")
        
        # OpenAI configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = openai.OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        
        # Data directory
        self.data_dir = "data"
        os.makedirs(self.data_dir, exist_ok=True)
        self.data_file = os.path.join(self.data_dir, "consultants.json")
        
        if not all([self.client_id, self.client_secret, self.refresh_token, self.postgres_url]):
            raise ValueError("Missing required environment variables in .env file")
        
        if not self.openai_api_key:
            logger.warning("⚠️ OPENAI_API_KEY not found - embeddings will be skipped")
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """Generate OpenAI embedding for text with retry logic"""
        if not self.openai_client or not text:
            return None
        
        try:
            # Truncate text if too long (OpenAI limit is 8192 tokens, roughly 6000 chars)
            if len(text) > 6000:
                text = text[:6000]
            
            # Add retry logic for API errors
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = self.openai_client.embeddings.create(
                        model="text-embedding-ada-002",
                        input=text
                    )
                    return response.data[0].embedding
                except Exception as e:
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt  # Exponential backoff
                        logger.warning(f"OpenAI API error (attempt {attempt + 1}), retrying in {wait_time}s: {e}")
                        time.sleep(wait_time)
                    else:
                        logger.error(f"OpenAI API failed after {max_retries} attempts: {e}")
                        return None
            
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return None
    
    def get_access_token(self) -> Optional[str]:
        """Get access token from refresh token"""
        try:
            token_url = f"{self.accounts_url}/oauth/v2/token"
            params = {
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token
            }
            
            logger.info("Requesting access token from Zoho...")
            response = requests.post(token_url, data=params, timeout=30)
            response.raise_for_status()
            
            tokens = response.json()
            access_token = tokens.get("access_token")
            
            if access_token:
                logger.info("✅ Access token obtained successfully")
                return access_token
            else:
                logger.error("❌ No access token in response")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting access token: {e}")
            return None
    
    def fetch_all_contacts(self, access_token: str) -> List[Dict[str, Any]]:
        """Fetch all contacts from Zoho CRM"""
        contacts = []
        page = 1
        per_page = 200
        
        headers = {
            "Authorization": f"Zoho-oauthtoken {access_token}",
            "Content-Type": "application/json"
        }
        
        # All fields from simple_fetch_consultants.py
        all_fields = "id,First_Name,Last_Name,Email,Phone,Mobile,Home_Phone,Other_Phone,Fax,Contact_Type,Consultant_Status,Contact_Owner,Lead_Source,Consultant_Lead_Source,Account_Name,Title,Department,Mailing_Street,Mailing_City,Mailing_State,Mailing_Zip,Mailing_Country,Location,Practice_Area,Hourly_Rate_Low,Hourly_Rate_High,Hourly_rate_range,Business_Strategy_Skills,Finance_Skills,Law_Skills,Marketing_and_Public_Relations_Skills,Nonprofit_Skills,What_is_your_professional_passion,What_sort_of_projects_excite_you,Would_you_be_open_to_a_full_time_engagement,How_did_you_hear_about_us,Referred_By,Professional_Reference_1_Name,Professional_Reference_1_Organization,Professional_Reference_1_Title,Professional_Reference_1_Email,Professional_Reference_1_Phone,Professional_Reference_1_Notes_Relationship_Histor,Professional_Reference_2_Name,Professional_Reference_2_Organization,Professional_Reference_2_Title,Professional_Reference_2_Email,Professional_Reference_2_Phone,Professional_Reference_2_Notes_Relationship_Histor,Description,Interview_Notes,Reference_Call_Notes,Keywords,LinkedIn,LinkedIn_Connection,Invitation_Lists,Created_Time,Modified_Time,Last_Activity_Time,Resume_File"
        
        while True:
            try:
                url = f"{self.crm_api_url}/Contacts"
                params = {
                    "page": page,
                    "per_page": per_page,
                    "fields": all_fields
                }
                
                logger.info(f"Fetching page {page}...")
                response = requests.get(url, headers=headers, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                records = data.get("data", [])
                
                if not records:
                    break
                
                contacts.extend(records)
                page += 1
                
                info = data.get("info", {})
                if not info.get("more_records", False):
                    break
                    
            except Exception as e:
                logger.error(f"Error fetching contacts from page {page}: {e}")
                break
        
        logger.info(f"✅ Fetched {len(contacts)} total contacts from Zoho CRM")
        return contacts
    
    def fetch_contact_attachments(self, contact_id: str, access_token: str) -> List[Dict[str, Any]]:
        """Fetch attachments for a specific contact"""
        attachments = []
        headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
        url = f"{self.crm_api_url}/Contacts/{contact_id}/Attachments"
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            attachments = data.get("data", [])
            logger.info(f"Found {len(attachments)} attachments for contact {contact_id}")
        except Exception as e:
            logger.error(f"Error fetching attachments for contact {contact_id}: {e}")
        
        return attachments
    
    def extract_attachment_text(self, attachment: Dict[str, Any], access_token: str, contact_id: str) -> str:
        """Extract text from attachment"""
        try:
            file_name = attachment.get("File_Name", "")
            if not file_name:
                return ""
            
            attachment_id = attachment.get("id", "")
            if not attachment_id:
                return f"[Attachment metadata: {file_name}]"
            
            # Construct full URL
            file_url = f"{self.crm_api_url}/Contacts/{contact_id}/Attachments/{attachment_id}"
            
            logger.info(f"Downloading attachment: {file_name}")
            headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
            response = requests.get(file_url, headers=headers, timeout=30)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '').lower()
            file_name_lower = file_name.lower()
            
            if 'pdf' in content_type or file_name_lower.endswith('.pdf'):
                return f"[PDF File: {file_name} - Size: {len(response.content)} bytes]"
            elif 'docx' in content_type or file_name_lower.endswith('.docx') or file_name_lower.endswith('.doc'):
                return f"[DOCX File: {file_name} - Size: {len(response.content)} bytes]"
            elif 'text' in content_type or file_name_lower.endswith('.txt'):
                return response.text
            else:
                return f"[File: {file_name} - Type: {content_type} - Size: {len(response.content)} bytes]"
                
        except Exception as e:
            logger.error(f"Error extracting text from attachment {attachment.get('File_Name')}: {e}")
            return f"[Error extracting {attachment.get('File_Name', 'unknown')}: {str(e)}]"
    
    def process_consultant_with_attachments(self, contact: Dict[str, Any], access_token: str) -> Optional[Dict[str, Any]]:
        """Process consultant contact with all attachments"""
        try:
            # Filter for consultants only
            contact_type = contact.get('Contact_Type', '')
            if isinstance(contact_type, list):
                contact_type = contact_type[0] if contact_type else ''
            
            if contact_type.lower() != 'consultant':
                return None
            
            # Extract basic consultant data
            consultant_data = {
                # Basic Information
                "consultant_id": contact.get('id'),
                "name": f"{contact.get('First_Name', '')} {contact.get('Last_Name', '')}".strip(),
                "email": contact.get('Email'),
                "phone": contact.get('Phone'),
                "mobile": contact.get('Mobile'),
                "home_phone": contact.get('Home_Phone'),
                "other_phone": contact.get('Other_Phone'),
                "fax": contact.get('Fax'),
                
                # Contact Information
                "contact_type": contact_type,
                "consultant_status": contact.get('Consultant_Status'),
                "contact_owner": contact.get('Contact_Owner'),
                "lead_source": contact.get('Lead_Source'),
                "consultant_lead_source": contact.get('Consultant_Lead_Source'),
                "account_name": contact.get('Account_Name'),
                "title": contact.get('Title'),
                "department": contact.get('Department'),
                
                # Address Information
                "mailing_street": contact.get('Mailing_Street'),
                "mailing_city": contact.get('Mailing_City'),
                "mailing_state": contact.get('Mailing_State'),
                "mailing_zip": contact.get('Mailing_Zip'),
                "mailing_country": contact.get('Mailing_Country'),
                "location": contact.get('Location'),
                
                # Professional Information
                "practice_area": contact.get('Practice_Area'),
                "hourly_rate_low": contact.get('Hourly_Rate_Low'),
                "hourly_rate_high": contact.get('Hourly_Rate_High'),
                "hourly_rate_range": contact.get('Hourly_rate_range'),
                
                # Skills
                "business_strategy_skills": contact.get('Business_Strategy_Skills'),
                "finance_skills": contact.get('Finance_Skills'),
                "law_skills": contact.get('Law_Skills'),
                "marketing_pr_skills": contact.get('Marketing_and_Public_Relations_Skills'),
                "nonprofit_skills": contact.get('Nonprofit_Skills'),
                
                # Professional Details
                "professional_passion": contact.get('What_is_your_professional_passion'),
                "projects_excite": contact.get('What_sort_of_projects_excite_you'),
                "open_to_fulltime": contact.get('Would_you_be_open_to_a_full_time_engagement'),
                "how_heard_about_us": contact.get('How_did_you_hear_about_us'),
                "referred_by": contact.get('Referred_By'),
                
                # Professional References
                "professional_reference_1_name": contact.get('Professional_Reference_1_Name'),
                "professional_reference_1_email": contact.get('Professional_Reference_1_Email'),
                "professional_reference_2_name": contact.get('Professional_Reference_2_Name'),
                "professional_reference_2_email": contact.get('Professional_Reference_2_Email'),
                
                # Additional Information
                "description": contact.get('Description'),
                "interview_notes": contact.get('Interview_Notes'),
                "reference_call_notes": contact.get('Reference_Call_Notes'),
                "keywords": contact.get('Keywords'),
                "linkedin": contact.get('LinkedIn'),
                "linkedin_connection": contact.get('LinkedIn_Connection'),
                "invitation_lists": contact.get('Invitation_Lists'),
                
                # Timestamps
                "created_time": contact.get('Created_Time'),
                "modified_time": contact.get('Modified_Time'),
                "last_activity_time": contact.get('Last_Activity_Time'),
                
                "resume_text": "",
                "attachments": [],
                "attachment_texts": {}
            }
            
            # Fetch attachments
            attachments_metadata = self.fetch_contact_attachments(consultant_data["consultant_id"], access_token)
            
            for attachment in attachments_metadata:
                attachment_data = {
                    "file_name": attachment.get('File_Name', ''),
                    "attachment_id": attachment.get('id', ''),
                    "file_size": attachment.get('Size', ''),
                    "file_type": attachment.get('File_Type', ''),
                    "created_time": attachment.get('Created_Time', ''),
                    "modified_time": attachment.get('Modified_Time', ''),
                    "file_url": attachment.get('File_Name', ''),
                    "extracted_text": ""
                }
                
                # Extract text from attachment
                extracted_text = self.extract_attachment_text(attachment, access_token, contact.get('id'))
                attachment_data["extracted_text"] = extracted_text
                
                consultant_data["attachments"].append(attachment_data)
                consultant_data["attachment_texts"][attachment_data["file_name"]] = extracted_text
                
                # If this is a resume file, also store in resume_text
                if "resume" in attachment_data["file_name"].lower():
                    consultant_data["resume_text"] = extracted_text
            
            return consultant_data
            
        except Exception as e:
            logger.error(f"Error processing contact {contact.get('id')}: {e}")
            return None
    
    def save_consultants_to_json(self, consultants: List[Dict[str, Any]]):
        """Save consultants to JSON file"""
        try:
            # Create backup
            if os.path.exists(self.data_file):
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_file = f"{self.data_file}.backup.{timestamp}"
                os.rename(self.data_file, backup_file)
                logger.info(f"Created backup: {backup_file}")
            
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(consultants, f, indent=2, ensure_ascii=False, default=str)
            
            logger.info(f"✅ Saved {len(consultants)} consultants to {self.data_file}")
            
        except Exception as e:
            logger.error(f"Error saving consultants to JSON: {e}")
            raise
    
    def migrate_consultant_to_db(self, consultant: Dict[str, Any]) -> bool:
        """Migrate a single consultant to PostgreSQL with embeddings"""
        try:
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            # Create search text
            search_fields = [
                consultant.get('name', ''),
                consultant.get('email', ''),
                consultant.get('title', ''),
                consultant.get('practice_area', ''),
                consultant.get('location', ''),
                consultant.get('business_strategy_skills', ''),
                consultant.get('finance_skills', ''),
                consultant.get('law_skills', ''),
                consultant.get('marketing_pr_skills', ''),
                consultant.get('nonprofit_skills', ''),
                consultant.get('professional_passion', ''),
                consultant.get('projects_excite', ''),
                consultant.get('description', ''),
                consultant.get('keywords', ''),
                consultant.get('resume_text', '')
            ]
            
            # Add attachment text
            for attachment in consultant.get('attachments', []):
                search_fields.append(attachment.get('extracted_text', ''))
            
            search_text = ' '.join(filter(None, search_fields))
            
            # Generate embedding
            embedding = self.get_embedding(search_text)
            
            # Insert consultant with embedding
            cursor.execute("""
                INSERT INTO consultants (
                    consultant_id, name, email, phone, contact_type, 
                    consultant_status, search_text, embedding, zoho_data
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (consultant_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    contact_type = EXCLUDED.contact_type,
                    consultant_status = EXCLUDED.consultant_status,
                    search_text = EXCLUDED.search_text,
                    embedding = EXCLUDED.embedding,
                    zoho_data = EXCLUDED.zoho_data,
                    extracted_at = CURRENT_TIMESTAMP
            """, (
                consultant.get('consultant_id'),
                consultant.get('name'),
                consultant.get('email'),
                consultant.get('phone'),
                consultant.get('contact_type'),
                consultant.get('consultant_status'),
                search_text,
                embedding,
                json.dumps(consultant)
            ))
            
            # Insert attachments with embeddings
            for attachment in consultant.get('attachments', []):
                attachment_embedding = self.get_embedding(attachment.get('extracted_text', ''))
                
                cursor.execute("""
                    INSERT INTO consultant_attachments (
                        consultant_id, attachment_id, file_name, file_size, file_type,
                        created_by, created_time, modified_time, file_url, extracted_text,
                        attachment_embedding
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (consultant_id, attachment_id) DO UPDATE SET
                        file_name = EXCLUDED.file_name,
                        file_size = EXCLUDED.file_size,
                        file_type = EXCLUDED.file_type,
                        created_by = EXCLUDED.created_by,
                        created_time = EXCLUDED.created_time,
                        modified_time = EXCLUDED.modified_time,
                        file_url = EXCLUDED.file_url,
                        extracted_text = EXCLUDED.extracted_text,
                        attachment_embedding = EXCLUDED.attachment_embedding,
                        created_at = CURRENT_TIMESTAMP
                """, (
                    consultant.get('consultant_id'),
                    attachment.get('id'),
                    attachment.get('file_name'),
                    attachment.get('file_size'),
                    attachment.get('file_type'),
                    attachment.get('created_by'),
                    attachment.get('created_time'),
                    attachment.get('modified_time'),
                    attachment.get('file_url'),
                    attachment.get('extracted_text'),
                    attachment_embedding
                ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return True
            
        except Exception as e:
            logger.error(f"Error migrating consultant {consultant.get('consultant_id')}: {e}")
            if 'conn' in locals():
                conn.rollback()
                conn.close()
            return False
    
    async def run_full_sync(self) -> Dict[str, Any]:
        """Run full synchronization from Zoho to PostgreSQL"""
        logger.info("🚀 Starting full sync from Zoho CRM to PostgreSQL...")
        
        try:
            # Step 1: Get access token
            access_token = self.get_access_token()
            if not access_token:
                return {"success": False, "message": "Failed to get access token"}
            
            # Step 2: Fetch all contacts
            logger.info("📥 Fetching all contacts from Zoho CRM...")
            contacts = self.fetch_all_contacts(access_token)
            
            # Step 3: Filter and process consultants
            logger.info("🔍 Processing consultants...")
            consultants = []
            processed_count = 0
            
            for i, contact in enumerate(contacts, 1):
                consultant = self.process_consultant_with_attachments(contact, access_token)
                if consultant:
                    consultants.append(consultant)
                    processed_count += 1
                
                if i % 50 == 0:
                    logger.info(f"Processed {i}/{len(contacts)} contacts, found {processed_count} consultants")
            
            logger.info(f"✅ Found {processed_count} consultants out of {len(contacts)} contacts")
            
            # Step 4: Save to JSON
            logger.info("💾 Saving consultants to JSON...")
            self.save_consultants_to_json(consultants)
            
            # Step 5: Migrate to PostgreSQL
            logger.info("🗄️ Migrating consultants to PostgreSQL...")
            migrated_count = 0
            failed_count = 0
            
            for i, consultant in enumerate(consultants, 1):
                if self.migrate_consultant_to_db(consultant):
                    migrated_count += 1
                else:
                    failed_count += 1
                
                if i % 50 == 0:
                    logger.info(f"Migrated {i}/{len(consultants)} consultants to database")
            
            result = {
                "success": True,
                "message": f"Full sync completed successfully",
                "total_contacts": len(contacts),
                "consultants_found": processed_count,
                "migrated_count": migrated_count,
                "failed_count": failed_count,
                "timestamp": datetime.now().isoformat()
            }
            
            logger.info(f"🎉 Full sync completed: {migrated_count}/{processed_count} consultants migrated")
            return result
            
        except Exception as e:
            logger.error(f"❌ Full sync failed: {e}")
            return {"success": False, "message": str(e)}
    
    def start_scheduler(self, interval_hours: int = 24):
        """Start the scheduler for periodic sync"""
        logger.info(f"⏰ Starting ETL scheduler - sync every {interval_hours} hours")
        
        # Schedule full sync
        schedule.every(interval_hours).hours.do(
            lambda: asyncio.create_task(self.run_full_sync())
        )
        
        # Run initial sync
        logger.info("🔄 Running initial sync...")
        asyncio.create_task(self.run_full_sync())
        
        # Keep scheduler running
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

async def main():
    """Main function"""
    print("🚀 Zoho ETL Pipeline")
    print("=" * 40)
    
    try:
        etl = ZohoETLPipeline()
        
        # Show current status
        if os.path.exists(etl.data_file):
            with open(etl.data_file, 'r', encoding='utf-8') as f:
                consultants = json.load(f)
            print(f"📊 Current consultants in JSON: {len(consultants)}")
        else:
            print("📊 No existing consultant data found")
        
        # Check database
        try:
            conn = psycopg2.connect(etl.postgres_url)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM consultants")
            db_count = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            print(f"🗄️ Current consultants in database: {db_count}")
        except Exception as e:
            print(f"🗄️ Database check failed: {e}")
        
        print("\n🚀 Starting ETL pipeline...")
        print("   - Full sync every 24 hours")
        print("   - Press Ctrl+C to stop")
        
        # Start scheduler
        etl.start_scheduler()
        
    except KeyboardInterrupt:
        print("\n🛑 ETL pipeline stopped by user")
    except Exception as e:
        print(f"❌ ETL pipeline error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
