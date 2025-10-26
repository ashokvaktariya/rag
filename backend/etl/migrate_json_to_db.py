#!/usr/bin/env python3
"""
Complete JSON to Database Migration with Single Comprehensive Embedding
This script will migrate all consultant data from JSON to PostgreSQL
with a single comprehensive embedding that includes ALL consultant data
"""

import json
import logging
import os
import psycopg2
import openai
from datetime import datetime
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class JSONToDatabaseMigrator:
    """Migrate consultant data from JSON to PostgreSQL"""
    
    def __init__(self):
        # PostgreSQL configuration
        self.postgres_url = os.getenv("POSTGRES_URL")
        
        # OpenAI configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = openai.OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        
        # JSON file path (from project root)
        self.json_file = os.path.join(os.path.dirname(__file__), '..', 'consultants.json')
        
        if not self.postgres_url:
            raise ValueError("POSTGRES_URL not found in environment variables")
        
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
                        import time
                        time.sleep(wait_time)
                    else:
                        logger.error(f"OpenAI API failed after {max_retries} attempts: {e}")
                        return None
            
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return None
    
    def create_comprehensive_search_text(self, consultant: Dict[str, Any]) -> str:
        """Create comprehensive search text from ALL consultant data for single embedding"""
        search_fields = []
        
        # Basic Information
        search_fields.extend([
            consultant.get('name', ''),
            consultant.get('email', ''),
            consultant.get('title', ''),
            consultant.get('practice_area', ''),
            consultant.get('location', ''),
            consultant.get('phone', ''),
            consultant.get('mobile', ''),
            consultant.get('department', ''),
        ])
        
        # Professional Skills (handle both string and list formats)
        skills_fields = [
            'business_strategy_skills',
            'finance_skills', 
            'law_skills',
            'marketing_pr_skills',
            'nonprofit_skills'
        ]
        
        for skill_field in skills_fields:
            skill_data = consultant.get(skill_field, '')
            if isinstance(skill_data, list):
                search_fields.append(' '.join(str(item) for item in skill_data if item))
            else:
                search_fields.append(str(skill_data) if skill_data else '')
        
        # Professional Details
        search_fields.extend([
            consultant.get('professional_passion', ''),
            consultant.get('projects_excite', ''),
            consultant.get('description', ''),
            consultant.get('keywords', ''),
            consultant.get('interview_notes', ''),
            consultant.get('reference_call_notes', ''),
        ])
        
        # Address Information
        search_fields.extend([
            consultant.get('mailing_street', ''),
            consultant.get('mailing_city', ''),
            consultant.get('mailing_state', ''),
            consultant.get('mailing_country', ''),
        ])
        
        # Professional References
        ref_fields = [
            'professional_reference_1_name',
            'professional_reference_1_organization', 
            'professional_reference_1_title',
            'professional_reference_2_name',
            'professional_reference_2_organization',
            'professional_reference_2_title',
        ]
        
        for ref_field in ref_fields:
            search_fields.append(consultant.get(ref_field, ''))
        
        # Attachment Text Content
        search_fields.extend([
            consultant.get('resume_text', ''),
            consultant.get('form_text', ''),
        ])
        
        # Additional metadata
        search_fields.extend([
            consultant.get('how_heard_about_us', ''),
            consultant.get('referred_by', ''),
            consultant.get('linkedin', ''),
        ])
        
        # Handle contact_type if it's a list
        contact_type = consultant.get('contact_type', '')
        if isinstance(contact_type, list):
            search_fields.append(' '.join(str(item) for item in contact_type if item))
        else:
            search_fields.append(str(contact_type) if contact_type else '')
        
        # Join all fields and clean up
        comprehensive_text = ' '.join(filter(None, search_fields))
        
        # Remove extra whitespace and limit length for OpenAI API
        comprehensive_text = ' '.join(comprehensive_text.split())
        
        # Truncate if too long (OpenAI limit is ~6000 chars for embeddings)
        if len(comprehensive_text) > 6000:
            comprehensive_text = comprehensive_text[:6000]
        
        return comprehensive_text
    
    def migrate_consultant(self, consultant: Dict[str, Any]) -> bool:
        """Migrate a single consultant to PostgreSQL with single comprehensive embedding"""
        try:
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            # Create comprehensive search text from ALL data
            comprehensive_text = self.create_comprehensive_search_text(consultant)
            
            # Generate single comprehensive embedding
            comprehensive_embedding = self.get_embedding(comprehensive_text)
            
            # Insert/update consultant with all fields and single comprehensive embedding
            cursor.execute("""
                INSERT INTO consultants (
                    consultant_id, first_name, last_name, name, email, phone, mobile, home_phone, other_phone, fax,
                    contact_type, consultant_status, contact_owner, lead_source, consultant_lead_source, account_name, title, department,
                    mailing_street, mailing_city, mailing_state, mailing_zip, mailing_country, location,
                    practice_area, hourly_rate_low, hourly_rate_high, hourly_rate_range,
                    business_strategy_skills, finance_skills, law_skills, marketing_pr_skills, nonprofit_skills,
                    professional_passion, projects_excite, open_to_fulltime, how_heard_about_us, referred_by,
                    professional_reference_1_name, professional_reference_1_organization, professional_reference_1_title, professional_reference_1_email, professional_reference_1_phone, professional_reference_1_notes,
                    professional_reference_2_name, professional_reference_2_organization, professional_reference_2_title, professional_reference_2_email, professional_reference_2_phone, professional_reference_2_notes,
                    description, interview_notes, reference_call_notes, keywords, linkedin, linkedin_connection, invitation_lists,
                    created_time, modified_time, last_activity_time,
                    resume_file_name, resume_file_size, resume_file_type, resume_file_url, resume_text,
                    form_file_name, form_file_size, form_file_type, form_file_url, form_text,
                    search_text, embedding, zoho_data
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s
                ) ON CONFLICT (consultant_id) DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    mobile = EXCLUDED.mobile,
                    home_phone = EXCLUDED.home_phone,
                    other_phone = EXCLUDED.other_phone,
                    fax = EXCLUDED.fax,
                    contact_type = EXCLUDED.contact_type,
                    consultant_status = EXCLUDED.consultant_status,
                    contact_owner = EXCLUDED.contact_owner,
                    lead_source = EXCLUDED.lead_source,
                    consultant_lead_source = EXCLUDED.consultant_lead_source,
                    account_name = EXCLUDED.account_name,
                    title = EXCLUDED.title,
                    department = EXCLUDED.department,
                    mailing_street = EXCLUDED.mailing_street,
                    mailing_city = EXCLUDED.mailing_city,
                    mailing_state = EXCLUDED.mailing_state,
                    mailing_zip = EXCLUDED.mailing_zip,
                    mailing_country = EXCLUDED.mailing_country,
                    location = EXCLUDED.location,
                    practice_area = EXCLUDED.practice_area,
                    hourly_rate_low = EXCLUDED.hourly_rate_low,
                    hourly_rate_high = EXCLUDED.hourly_rate_high,
                    hourly_rate_range = EXCLUDED.hourly_rate_range,
                    business_strategy_skills = EXCLUDED.business_strategy_skills,
                    finance_skills = EXCLUDED.finance_skills,
                    law_skills = EXCLUDED.law_skills,
                    marketing_pr_skills = EXCLUDED.marketing_pr_skills,
                    nonprofit_skills = EXCLUDED.nonprofit_skills,
                    professional_passion = EXCLUDED.professional_passion,
                    projects_excite = EXCLUDED.projects_excite,
                    open_to_fulltime = EXCLUDED.open_to_fulltime,
                    how_heard_about_us = EXCLUDED.how_heard_about_us,
                    referred_by = EXCLUDED.referred_by,
                    professional_reference_1_name = EXCLUDED.professional_reference_1_name,
                    professional_reference_1_organization = EXCLUDED.professional_reference_1_organization,
                    professional_reference_1_title = EXCLUDED.professional_reference_1_title,
                    professional_reference_1_email = EXCLUDED.professional_reference_1_email,
                    professional_reference_1_phone = EXCLUDED.professional_reference_1_phone,
                    professional_reference_1_notes = EXCLUDED.professional_reference_1_notes,
                    professional_reference_2_name = EXCLUDED.professional_reference_2_name,
                    professional_reference_2_organization = EXCLUDED.professional_reference_2_organization,
                    professional_reference_2_title = EXCLUDED.professional_reference_2_title,
                    professional_reference_2_email = EXCLUDED.professional_reference_2_email,
                    professional_reference_2_phone = EXCLUDED.professional_reference_2_phone,
                    professional_reference_2_notes = EXCLUDED.professional_reference_2_notes,
                    description = EXCLUDED.description,
                    interview_notes = EXCLUDED.interview_notes,
                    reference_call_notes = EXCLUDED.reference_call_notes,
                    keywords = EXCLUDED.keywords,
                    linkedin = EXCLUDED.linkedin,
                    linkedin_connection = EXCLUDED.linkedin_connection,
                    invitation_lists = EXCLUDED.invitation_lists,
                    created_time = EXCLUDED.created_time,
                    modified_time = EXCLUDED.modified_time,
                    last_activity_time = EXCLUDED.last_activity_time,
                    resume_file_name = EXCLUDED.resume_file_name,
                    resume_file_size = EXCLUDED.resume_file_size,
                    resume_file_type = EXCLUDED.resume_file_type,
                    resume_file_url = EXCLUDED.resume_file_url,
                    resume_text = EXCLUDED.resume_text,
                    form_file_name = EXCLUDED.form_file_name,
                    form_file_size = EXCLUDED.form_file_size,
                    form_file_type = EXCLUDED.form_file_type,
                    form_file_url = EXCLUDED.form_file_url,
                    form_text = EXCLUDED.form_text,
                    search_text = EXCLUDED.search_text,
                    embedding = EXCLUDED.embedding,
                    zoho_data = EXCLUDED.zoho_data,
                    extracted_at = CURRENT_TIMESTAMP
            """, (
                consultant.get('consultant_id'),
                consultant.get('first_name'),
                consultant.get('last_name'),
                consultant.get('name'),
                consultant.get('email'),
                consultant.get('phone'),
                consultant.get('mobile'),
                consultant.get('home_phone'),
                consultant.get('other_phone'),
                consultant.get('fax'),
                consultant.get('contact_type'),
                consultant.get('consultant_status'),
                consultant.get('contact_owner'),
                consultant.get('lead_source'),
                consultant.get('consultant_lead_source'),
                consultant.get('account_name'),
                consultant.get('title'),
                consultant.get('department'),
                consultant.get('mailing_street'),
                consultant.get('mailing_city'),
                consultant.get('mailing_state'),
                consultant.get('mailing_zip'),
                consultant.get('mailing_country'),
                consultant.get('location'),
                consultant.get('practice_area'),
                consultant.get('hourly_rate_low'),
                consultant.get('hourly_rate_high'),
                consultant.get('hourly_rate_range'),
                json.dumps(consultant.get('business_strategy_skills', [])),
                json.dumps(consultant.get('finance_skills', [])),
                json.dumps(consultant.get('law_skills', [])),
                json.dumps(consultant.get('marketing_pr_skills', [])),
                json.dumps(consultant.get('nonprofit_skills', [])),
                consultant.get('professional_passion'),
                consultant.get('projects_excite'),
                consultant.get('open_to_fulltime'),
                consultant.get('how_heard_about_us'),
                consultant.get('referred_by'),
                consultant.get('professional_reference_1_name'),
                consultant.get('professional_reference_1_organization'),
                consultant.get('professional_reference_1_title'),
                consultant.get('professional_reference_1_email'),
                consultant.get('professional_reference_1_phone'),
                consultant.get('professional_reference_1_notes'),
                consultant.get('professional_reference_2_name'),
                consultant.get('professional_reference_2_organization'),
                consultant.get('professional_reference_2_title'),
                consultant.get('professional_reference_2_email'),
                consultant.get('professional_reference_2_phone'),
                consultant.get('professional_reference_2_notes'),
                consultant.get('description'),
                consultant.get('interview_notes'),
                consultant.get('reference_call_notes'),
                json.dumps(consultant.get('keywords', [])),
                consultant.get('linkedin'),
                consultant.get('linkedin_connection'),
                consultant.get('invitation_lists'),
                consultant.get('created_time'),
                consultant.get('modified_time'),
                consultant.get('last_activity_time'),
                consultant.get('resume_file_name'),
                consultant.get('resume_file_size'),
                consultant.get('resume_file_type'),
                consultant.get('resume_file_url'),
                consultant.get('resume_text'),
                consultant.get('form_file_name'),
                consultant.get('form_file_size'),
                consultant.get('form_file_type'),
                consultant.get('form_file_url'),
                consultant.get('form_text'),
                comprehensive_text,
                comprehensive_embedding,
                json.dumps(consultant)
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
    
    def run_migration(self) -> Dict[str, Any]:
        """Run complete migration from JSON to database"""
        logger.info("🚀 Starting JSON to Database Migration")
        
        try:
            # Load JSON data
            if not os.path.exists(self.json_file):
                return {"success": False, "message": f"JSON file not found: {self.json_file}"}
            
            with open(self.json_file, 'r', encoding='utf-8') as f:
                consultants = json.load(f)
            
            logger.info(f"📊 Loaded {len(consultants)} consultants from JSON")
            
            # Migrate consultants
            migrated_count = 0
            failed_count = 0
            
            for i, consultant in enumerate(consultants, 1):
                if self.migrate_consultant(consultant):
                    migrated_count += 1
                else:
                    failed_count += 1
                
                if i % 50 == 0:
                    logger.info(f"Progress: {i}/{len(consultants)} consultants processed. Success: {migrated_count}, Failed: {failed_count}")
            
            result = {
                "success": True,
                "message": f"Migration completed successfully",
                "total_consultants": len(consultants),
                "migrated_count": migrated_count,
                "failed_count": failed_count,
                "timestamp": datetime.now().isoformat()
            }
            
            logger.info(f"🎉 Migration completed: {migrated_count}/{len(consultants)} consultants migrated")
            return result
            
        except Exception as e:
            logger.error(f"❌ Migration failed: {e}")
            return {"success": False, "message": str(e)}

def main():
    """Main function"""
    print("🚀 JSON to Database Migration")
    print("=" * 50)
    
    try:
        migrator = JSONToDatabaseMigrator()
        
        # Show current status
        if os.path.exists(migrator.json_file):
            with open(migrator.json_file, 'r', encoding='utf-8') as f:
                consultants = json.load(f)
            print(f"📊 Consultants in JSON: {len(consultants)}")
        else:
            print(f"❌ JSON file not found: {migrator.json_file}")
            return
        
        # Check database
        try:
            conn = psycopg2.connect(migrator.postgres_url)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM consultants")
            db_count = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            print(f"🗄️ Current consultants in database: {db_count}")
        except Exception as e:
            print(f"🗄️ Database check failed: {e}")
        
        print("\n🚀 Starting migration...")
        print("   - All consultant fields will be migrated")
        print("   - PDF/DOCX text will be included")
        print("   - Single comprehensive embedding will be generated from ALL data")
        print("   - Existing records will be updated")
        
        # Run migration
        result = migrator.run_migration()
        
        if result["success"]:
            print(f"\n✅ SUCCESS!")
            print(f"   - Total consultants: {result['total_consultants']}")
            print(f"   - Successfully migrated: {result['migrated_count']}")
            print(f"   - Failed migrations: {result['failed_count']}")
            print(f"   - Timestamp: {result['timestamp']}")
            print(f"\n📊 Success Rate: {(result['migrated_count']/(result['total_consultants'])*100):.1f}%")
        else:
            print(f"\n❌ FAILED: {result['message']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
