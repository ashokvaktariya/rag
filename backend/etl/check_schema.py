#!/usr/bin/env python3
"""
Database Schema Creator and Checker
This script will create the database schema and check all fields
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load .env from project root (../../.env from this file's location)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

def create_database_schema():
    """Create PostgreSQL database schema for consultant data"""
    try:
        # Connect to database
        conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("🔧 Creating PostgreSQL schema for consultant data...")
        
        # Enable pgvector extension
        print("1. Enabling pgvector extension...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        
        # Create consultants table
        print("2. Creating consultants table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS consultants (
                id SERIAL PRIMARY KEY,
                consultant_id VARCHAR(50) UNIQUE NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                name VARCHAR(200),
                email VARCHAR(255),
                phone VARCHAR(50),
                mobile VARCHAR(50),
                home_phone VARCHAR(50),
                other_phone VARCHAR(50),
                fax VARCHAR(50),
                
                -- Contact Information
                contact_type VARCHAR(50),
                consultant_status VARCHAR(100),
                contact_owner VARCHAR(100),
                lead_source VARCHAR(100),
                consultant_lead_source VARCHAR(100),
                account_name VARCHAR(200),
                title VARCHAR(200),
                department VARCHAR(100),
                
                -- Address Information
                mailing_street TEXT,
                mailing_city VARCHAR(100),
                mailing_state VARCHAR(100),
                mailing_zip VARCHAR(20),
                mailing_country VARCHAR(100),
                location VARCHAR(200),
                
                -- Professional Information
                practice_area TEXT,
                hourly_rate_low DECIMAL(10,2),
                hourly_rate_high DECIMAL(10,2),
                hourly_rate_range VARCHAR(100),
                
                -- Skills
                business_strategy_skills TEXT,
                finance_skills TEXT,
                law_skills TEXT,
                marketing_pr_skills TEXT,
                nonprofit_skills TEXT,
                
                -- Professional Details
                professional_passion TEXT,
                projects_excite TEXT,
                open_to_fulltime VARCHAR(10),
                how_heard_about_us TEXT,
                referred_by VARCHAR(200),
                
                -- Professional References
                professional_reference_1_name VARCHAR(200),
                professional_reference_1_organization VARCHAR(200),
                professional_reference_1_title VARCHAR(200),
                professional_reference_1_email VARCHAR(255),
                professional_reference_1_phone VARCHAR(50),
                professional_reference_1_notes TEXT,
                
                professional_reference_2_name VARCHAR(200),
                professional_reference_2_organization VARCHAR(200),
                professional_reference_2_title VARCHAR(200),
                professional_reference_2_email VARCHAR(255),
                professional_reference_2_phone VARCHAR(50),
                professional_reference_2_notes TEXT,
                
                -- Additional Information
                description TEXT,
                interview_notes TEXT,
                reference_call_notes TEXT,
                keywords TEXT,
                linkedin VARCHAR(500),
                linkedin_connection VARCHAR(100),
                invitation_lists TEXT,
                
                -- Timestamps
                created_time TIMESTAMP,
                modified_time TIMESTAMP,
                last_activity_time TIMESTAMP,
                extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Attachment Data (separate columns for two main attachments)
                resume_file_name VARCHAR(500),
                resume_file_size VARCHAR(50),
                resume_file_type VARCHAR(100),
                resume_file_url TEXT,
                resume_text TEXT,
                
                form_file_name VARCHAR(500),
                form_file_size VARCHAR(50),
                form_file_type VARCHAR(100),
                form_file_url TEXT,
                form_text TEXT,
                
                -- Single comprehensive embedding for all data
                embedding vector(1536), -- OpenAI ada-002 embedding dimension
                
                -- Full text search
                search_text TEXT,
                
                -- Metadata
                zoho_data JSONB
            );
        """)
        
        # Create attachments table
        print("3. Creating attachments table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS consultant_attachments (
                id SERIAL PRIMARY KEY,
                consultant_id VARCHAR(50) REFERENCES consultants(consultant_id) ON DELETE CASCADE,
                attachment_id VARCHAR(50),
                file_name VARCHAR(500),
                file_size VARCHAR(50),
                file_type VARCHAR(100),
                created_by VARCHAR(100),
                created_time TIMESTAMP,
                modified_time TIMESTAMP,
                file_url TEXT,
                extracted_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create indexes for performance
        print("4. Creating indexes...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_consultants_email ON consultants(email);
            CREATE INDEX IF NOT EXISTS idx_consultants_status ON consultants(consultant_status);
            CREATE INDEX IF NOT EXISTS idx_consultants_practice_area ON consultants(practice_area);
            CREATE INDEX IF NOT EXISTS idx_consultants_location ON consultants(location);
            CREATE INDEX IF NOT EXISTS idx_consultants_created_time ON consultants(created_time);
            CREATE INDEX IF NOT EXISTS idx_consultants_modified_time ON consultants(modified_time);
            CREATE INDEX IF NOT EXISTS idx_consultants_search_text ON consultants USING gin(to_tsvector('english', search_text));
            CREATE INDEX IF NOT EXISTS idx_consultants_zoho_data ON consultants USING gin(zoho_data);
            
            -- Vector similarity search index
            CREATE INDEX IF NOT EXISTS idx_consultants_embedding ON consultants USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
        """)
        
        # Create sync tracking table
        print("5. Creating sync tracking table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sync_log (
                id SERIAL PRIMARY KEY,
                sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental'
                status VARCHAR(20) NOT NULL, -- 'started', 'completed', 'failed'
                total_contacts INTEGER,
                total_consultants INTEGER,
                processed_consultants INTEGER,
                errors_count INTEGER,
                error_details TEXT,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                duration_seconds INTEGER
            );
        """)
        
        print("✅ Database schema created successfully!")
        
        # Show table info
        cursor.execute("""
            SELECT 
                schemaname,
                tablename,
                tableowner
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename IN ('consultants', 'consultant_attachments', 'sync_log')
            ORDER BY tablename;
        """)
        
        tables = cursor.fetchall()
        print("\n📋 Created tables:")
        for table in tables:
            print(f"   - {table[1]}")
        
        # Check pgvector extension
        cursor.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
        vector_ext = cursor.fetchone()
        if vector_ext:
            print(f"\n✅ pgvector extension enabled: {vector_ext[1]}")
        else:
            print("\n❌ pgvector extension not found")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating schema: {e}")
        return False

def check_database_schema():
    """Check current database schema"""
    try:
        # Connect to database
        conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
        cursor = conn.cursor()
        
        print("🔍 Checking Database Schema")
        print("=" * 50)
        
        # Check if consultants table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'consultants'
            );
        """)
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            print("❌ Consultants table does not exist")
            return
        
        print("✅ Consultants table exists")
        
        # Get all columns from consultants table
        cursor.execute("""
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns 
            WHERE table_name = 'consultants' 
            AND table_schema = 'public'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        
        print(f"\n📊 Found {len(columns)} columns in consultants table:")
        print("-" * 80)
        print(f"{'Column Name':<30} {'Data Type':<20} {'Nullable':<10} {'Default'}")
        print("-" * 80)
        
        for col_name, data_type, nullable, default in columns:
            default_str = str(default)[:20] if default else "None"
            print(f"{col_name:<30} {data_type:<20} {nullable:<10} {default_str}")
        
        # Check if pgvector extension is enabled
        cursor.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
        vector_ext = cursor.fetchone()
        
        print(f"\n🔧 pgvector extension: {'✅ Enabled' if vector_ext else '❌ Not enabled'}")
        
        # Check for embedding columns
        embedding_columns = [col for col in columns if 'embedding' in col[0]]
        if embedding_columns:
            print(f"\n🧠 Found {len(embedding_columns)} embedding columns:")
            for col_name, data_type, _, _ in embedding_columns:
                print(f"   - {col_name}: {data_type}")
        else:
            print("\n🧠 No embedding columns found")
        
        # Check current record count
        cursor.execute("SELECT COUNT(*) FROM consultants;")
        count = cursor.fetchone()[0]
        print(f"\n📈 Current records in consultants table: {count}")
        
        cursor.close()
        conn.close()
        
        return columns
        
    except Exception as e:
        print(f"❌ Error checking schema: {e}")
        return None

def check_json_structure():
    """Check JSON data structure"""
    try:
        print("\n🔍 Checking JSON Data Structure")
        print("=" * 50)
        
        # Check if JSON file exists
        json_file = "data/consultants.json"
        if not os.path.exists(json_file):
            print(f"❌ JSON file not found: {json_file}")
            return None
        
        # Load sample data
        import json
        with open(json_file, 'r', encoding='utf-8') as f:
            consultants = json.load(f)
        
        print(f"✅ Found {len(consultants)} consultants in JSON")
        
        if consultants:
            # Get all fields from first consultant
            sample_consultant = consultants[0]
            fields = list(sample_consultant.keys())
            
            print(f"\n📊 Found {len(fields)} fields in JSON data:")
            print("-" * 50)
            
            for i, field in enumerate(sorted(fields), 1):
                value = sample_consultant.get(field)
                value_type = type(value).__name__
                value_preview = str(value)[:50] if value else "None"
                print(f"{i:2d}. {field:<35} {value_type:<15} {value_preview}")
            
            return fields
        
        return None
        
    except Exception as e:
        print(f"❌ Error checking JSON: {e}")
        return None

def main():
    """Main function"""
    print("🚀 Database Schema Creator & Checker")
    print("=" * 60)
    
    # Check environment variables
    if not os.getenv("POSTGRES_URL"):
        print("❌ POSTGRES_URL not found in environment variables")
        return
    
    # First, create/update database schema
    print("\n🔧 Step 1: Creating/Updating Database Schema")
    print("-" * 50)
    schema_created = create_database_schema()
    
    if not schema_created:
        print("❌ Failed to create database schema")
        return
    
    # Then check the schema
    print("\n🔍 Step 2: Checking Database Schema")
    print("-" * 50)
    db_columns = check_database_schema()
    
    # Check JSON structure
    print("\n📊 Step 3: Checking JSON Structure")
    print("-" * 50)
    json_fields = check_json_structure()
    
    # Compare and suggest updates
    if db_columns and json_fields:
        print("\n🔍 Step 4: Schema Comparison")
        print("-" * 50)
        
        db_field_names = [col[0] for col in db_columns]
        json_field_names = json_fields
        
        missing_in_db = set(json_field_names) - set(db_field_names)
        missing_in_json = set(db_field_names) - set(json_field_names)
        
        if missing_in_db:
            print(f"\n📝 Fields in JSON but missing in DB ({len(missing_in_db)}):")
            for field in sorted(missing_in_db):
                print(f"   - {field}")
        
        if missing_in_json:
            print(f"\n📝 Fields in DB but missing in JSON ({len(missing_in_json)}):")
            for field in sorted(missing_in_json):
                print(f"   - {field}")
        
        if not missing_in_db and not missing_in_json:
            print("\n✅ Database schema matches JSON structure perfectly!")
        else:
            print(f"\n⚠️ Schema differences found. Consider updating database schema.")
    
    print("\n🎉 Schema setup complete! Ready for data migration.")

if __name__ == "__main__":
    main()
