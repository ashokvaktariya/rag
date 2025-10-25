#!/usr/bin/env python3
"""
FastAPI Consultant Suggestion System
Uses vector embeddings for semantic search and consultant recommendations
"""

import os
import psycopg2
import openai
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Pydantic models
class ConsultantSearchRequest(BaseModel):
    query: str
    limit: int = 10
    min_similarity: float = 0.7
    filter_active: bool = False

class ConsultantSearchResponse(BaseModel):
    consultants: List[Dict[str, Any]]
    total_found: int
    query: str
    processing_time: float

class ConsultantDetail(BaseModel):
    consultant_id: str
    name: str
    email: str
    phone: Optional[str]
    practice_area: Optional[str]
    location: Optional[str]
    consultant_status: Optional[str]
    business_strategy_skills: Optional[str]
    finance_skills: Optional[str]
    law_skills: Optional[str]
    marketing_pr_skills: Optional[str]
    nonprofit_skills: Optional[str]
    professional_passion: Optional[str]
    projects_excite: Optional[str]
    description: Optional[str]
    keywords: Optional[str]
    similarity_score: float

class ConsultantSuggestionService:
    """Service for consultant suggestions using vector embeddings"""
    
    def __init__(self):
        # Database configuration
        self.postgres_url = os.getenv("POSTGRES_URL")
        
        # OpenAI configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = openai.OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        
        if not self.postgres_url:
            raise ValueError("POSTGRES_URL not found in .env file")
        
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in .env file")
    
    def get_query_embedding(self, query: str) -> Optional[List[float]]:
        """Generate embedding for search query"""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=query
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating query embedding: {e}")
            return None
    
    def search_consultants(self, query: str, limit: int = 10, min_similarity: float = 0.7, filter_active: bool = False) -> List[Dict[str, Any]]:
        """Search consultants using merged embedding column"""
        try:
            # Generate embedding for query
            query_embedding = self.get_query_embedding(query)
            if not query_embedding:
                return []
            
            # Convert to PostgreSQL vector format
            embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'
            
            # Connect to database
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            # Build the WHERE clause based on filters
            where_conditions = ["embedding IS NOT NULL", f"1 - (embedding <=> %s::vector) >= %s"]
            params = [embedding_str, embedding_str, min_similarity]
            
            if filter_active:
                where_conditions.append("consultant_status = 'Active'")
            
            where_clause = " AND ".join(where_conditions)
            
            # Search for similar consultants using merged embedding
            cursor.execute(f"""
                SELECT 
                    consultant_id, name, email, phone, practice_area, location,
                    consultant_status, business_strategy_skills, finance_skills,
                    law_skills, marketing_pr_skills, nonprofit_skills,
                    professional_passion, projects_excite, description, keywords,
                    title, hourly_rate_low, hourly_rate_high,
                    1 - (embedding <=> %s::vector) as similarity
                FROM consultants 
                WHERE {where_clause}
                ORDER BY embedding <=> %s::vector
                LIMIT %s
            """, params + [embedding_str, limit])
            
            results = []
            for row in cursor.fetchall():
                consultant = {
                    'consultant_id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'phone': row[3],
                    'practice_area': row[4],
                    'location': row[5],
                    'consultant_status': row[6],
                    'business_strategy_skills': row[7],
                    'finance_skills': row[8],
                    'law_skills': row[9],
                    'marketing_pr_skills': row[10],
                    'nonprofit_skills': row[11],
                    'professional_passion': row[12],
                    'projects_excite': row[13],
                    'description': row[14],
                    'keywords': row[15],
                    'title': row[16],
                    'hourly_rate_low': row[17],
                    'hourly_rate_high': row[18],
                    'similarity_score': float(row[19])
                }
                results.append(consultant)
            
            cursor.close()
            conn.close()
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching consultants: {e}")
            return []
    
    def get_consultant_by_id(self, consultant_id: str) -> Optional[Dict[str, Any]]:
        """Get consultant details by ID"""
        try:
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT 
                    consultant_id, first_name, last_name, name, email, phone, mobile, home_phone, other_phone, fax,
                    contact_type, consultant_status, contact_owner, lead_source, consultant_lead_source, account_name,
                    title, department, mailing_street, mailing_city, mailing_state, mailing_zip, mailing_country, location,
                    practice_area, hourly_rate_low, hourly_rate_high, hourly_rate_range,
                    business_strategy_skills, finance_skills, law_skills, marketing_pr_skills, nonprofit_skills,
                    professional_passion, projects_excite, open_to_fulltime, how_heard_about_us, referred_by,
                    professional_reference_1_name, professional_reference_1_organization, professional_reference_1_title,
                    professional_reference_1_email, professional_reference_1_phone, professional_reference_1_notes,
                    professional_reference_2_name, professional_reference_2_organization, professional_reference_2_title,
                    professional_reference_2_email, professional_reference_2_phone, professional_reference_2_notes,
                    description, interview_notes, reference_call_notes, keywords, linkedin, linkedin_connection,
                    invitation_lists, created_time, modified_time, last_activity_time, extracted_at, zoho_data
                FROM consultants 
                WHERE consultant_id = %s
            """, (consultant_id,))
            
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if row:
                return {
                    'consultant_id': row[0],
                    'first_name': row[1],
                    'last_name': row[2],
                    'name': row[3],
                    'email': row[4],
                    'phone': row[5],
                    'mobile': row[6],
                    'home_phone': row[7],
                    'other_phone': row[8],
                    'fax': row[9],
                    'contact_type': row[10],
                    'consultant_status': row[11],
                    'contact_owner': row[12],
                    'lead_source': row[13],
                    'consultant_lead_source': row[14],
                    'account_name': row[15],
                    'title': row[16],
                    'department': row[17],
                    'mailing_street': row[18],
                    'mailing_city': row[19],
                    'mailing_state': row[20],
                    'mailing_zip': row[21],
                    'mailing_country': row[22],
                    'location': row[23],
                    'practice_area': row[24],
                    'hourly_rate_low': row[25],
                    'hourly_rate_high': row[26],
                    'hourly_rate_range': row[27],
                    'business_strategy_skills': row[28],
                    'finance_skills': row[29],
                    'law_skills': row[30],
                    'marketing_pr_skills': row[31],
                    'nonprofit_skills': row[32],
                    'professional_passion': row[33],
                    'projects_excite': row[34],
                    'open_to_fulltime': row[35],
                    'how_heard_about_us': row[36],
                    'referred_by': row[37],
                    'professional_reference_1_name': row[38],
                    'professional_reference_1_organization': row[39],
                    'professional_reference_1_title': row[40],
                    'professional_reference_1_email': row[41],
                    'professional_reference_1_phone': row[42],
                    'professional_reference_1_notes': row[43],
                    'professional_reference_2_name': row[44],
                    'professional_reference_2_organization': row[45],
                    'professional_reference_2_title': row[46],
                    'professional_reference_2_email': row[47],
                    'professional_reference_2_phone': row[48],
                    'professional_reference_2_notes': row[49],
                    'description': row[50],
                    'interview_notes': row[51],
                    'reference_call_notes': row[52],
                    'keywords': row[53],
                    'linkedin': row[54],
                    'linkedin_connection': row[55],
                    'invitation_lists': row[56],
                    'created_time': row[57],
                    'modified_time': row[58],
                    'last_activity_time': row[59],
                    'extracted_at': row[60],
                    'zoho_data': row[61]
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting consultant {consultant_id}: {e}")
            return None
    
    def search_consultants_by_name(self, name_query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search consultants by name (case-insensitive partial match)"""
        try:
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            # Search for consultants by name (case-insensitive, partial match)
            cursor.execute("""
                SELECT 
                    consultant_id, name, email, phone, practice_area, location,
                    consultant_status, business_strategy_skills, finance_skills,
                    law_skills, marketing_pr_skills, nonprofit_skills,
                    professional_passion, projects_excite, description, keywords,
                    title, hourly_rate_low, hourly_rate_high
                FROM consultants 
                WHERE LOWER(name) LIKE LOWER(%s)
                ORDER BY name
                LIMIT %s
            """, (f"%{name_query}%", limit))
            
            results = []
            for row in cursor.fetchall():
                consultant = {
                    'consultant_id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'phone': row[3],
                    'practice_area': row[4],
                    'location': row[5],
                    'consultant_status': row[6],
                    'business_strategy_skills': row[7],
                    'finance_skills': row[8],
                    'law_skills': row[9],
                    'marketing_pr_skills': row[10],
                    'nonprofit_skills': row[11],
                    'professional_passion': row[12],
                    'projects_excite': row[13],
                    'description': row[14],
                    'keywords': row[15],
                    'title': row[16],
                    'hourly_rate_low': row[17],
                    'hourly_rate_high': row[18]
                }
                results.append(consultant)
            
            cursor.close()
            conn.close()
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching consultants by name '{name_query}': {e}")
            return []
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            conn = psycopg2.connect(self.postgres_url)
            cursor = conn.cursor()
            
            # Total consultants
            cursor.execute("SELECT COUNT(*) FROM consultants")
            total_consultants = cursor.fetchone()[0]
            
            # Consultants with embeddings
            cursor.execute("SELECT COUNT(*) FROM consultants WHERE embedding IS NOT NULL")
            with_embeddings = cursor.fetchone()[0]
            
            # Status distribution
            cursor.execute("""
                SELECT consultant_status, COUNT(*) 
                FROM consultants 
                GROUP BY consultant_status 
                ORDER BY COUNT(*) DESC
            """)
            status_distribution = dict(cursor.fetchall())
            
            cursor.close()
            conn.close()
            
            return {
                'total_consultants': total_consultants,
                'with_embeddings': with_embeddings,
                'without_embeddings': total_consultants - with_embeddings,
                'status_distribution': status_distribution
            }
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {}

# Initialize FastAPI app
app = FastAPI(
    title="Consultant Suggestion System",
    description="AI-powered consultant matching using vector embeddings",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
try:
    suggestion_service = ConsultantSuggestionService()
    logger.info("✅ Consultant suggestion service initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize service: {e}")
    suggestion_service = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Consultant Suggestion System",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if suggestion_service:
        stats = suggestion_service.get_database_stats()
        return {
            "status": "healthy",
            "database_connected": True,
            "total_consultants": stats.get('total_consultants', 0),
            "with_embeddings": stats.get('with_embeddings', 0)
        }
    else:
        return {
            "status": "unhealthy",
            "database_connected": False
        }

@app.post("/search", response_model=ConsultantSearchResponse)
async def search_consultants(request: ConsultantSearchRequest):
    """Search consultants using semantic similarity"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    import time
    start_time = time.time()
    
    try:
        consultants = suggestion_service.search_consultants(
            query=request.query,
            limit=request.limit,
            min_similarity=request.min_similarity,
            filter_active=request.filter_active
        )
        
        processing_time = time.time() - start_time
        
        return ConsultantSearchResponse(
            consultants=consultants,
            total_found=len(consultants),
            query=request.query,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/consultant/{consultant_id}")
async def get_consultant(consultant_id: str):
    """Get consultant details by ID"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    try:
        consultant = suggestion_service.get_consultant_by_id(consultant_id)
        if not consultant:
            raise HTTPException(status_code=404, detail="Consultant not found")
        
        return consultant
        
    except Exception as e:
        logger.error(f"Error getting consultant {consultant_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/consultants/search")
async def search_consultants_by_name(name: str, limit: int = 10):
    """Search consultants by name (case-insensitive partial match)"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    try:
        consultants = suggestion_service.search_consultants_by_name(name, limit)
        return {
            "consultants": consultants,
            "total_found": len(consultants),
            "search_query": name
        }
        
    except Exception as e:
        logger.error(f"Error searching consultants by name '{name}': {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get database statistics"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    try:
        stats = suggestion_service.get_database_stats()
        return stats
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/consultants")
async def get_all_consultants(limit: int = 50, offset: int = 0):
    """Get all consultants with pagination"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    try:
        conn = psycopg2.connect(suggestion_service.postgres_url)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                consultant_id, name, email, phone, practice_area, location,
                consultant_status, business_strategy_skills, finance_skills,
                law_skills, marketing_pr_skills, nonprofit_skills,
                professional_passion, projects_excite, description, keywords
            FROM consultants 
            ORDER BY name
            LIMIT %s OFFSET %s
        """, (limit, offset))
        
        consultants = []
        for row in cursor.fetchall():
            consultant = {
                'consultant_id': row[0],
                'name': row[1],
                'email': row[2],
                'phone': row[3],
                'practice_area': row[4],
                'location': row[5],
                'consultant_status': row[6],
                'business_strategy_skills': row[7],
                'finance_skills': row[8],
                'law_skills': row[9],
                'marketing_pr_skills': row[10],
                'nonprofit_skills': row[11],
                'professional_passion': row[12],
                'projects_excite': row[13],
                'description': row[14],
                'keywords': row[15]
            }
            consultants.append(consultant)
        
        cursor.close()
        conn.close()
        
        return {
            "consultants": consultants,
            "limit": limit,
            "offset": offset,
            "total": len(consultants)
        }
        
    except Exception as e:
        logger.error(f"Error getting consultants: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: dict):
    """Chat endpoint that handles both name searches and general queries"""
    if not suggestion_service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    
    try:
        query = request.get("message", "").strip()
        if not query:
            return {
                "response": "I'm the Canopy Assistant, specialized in helping you find the right consultants. You can ask me to find consultants with specific skills, experience, or expertise. You can also ask about specific consultants by name. For example, try asking 'Find a marketing strategy consultant', 'Who has healthcare experience?', or 'Tell me about Alex Rich'.",
                "consultants": [],
                "type": "general"
            }
        
        # Check if query is asking about a specific consultant by name
        name_keywords = ["tell me about", "who is", "about", "details about", "information about"]
        is_name_query = any(keyword in query.lower() for keyword in name_keywords)
        
        if is_name_query:
            # Extract name from query
            name = query.lower()
            for keyword in name_keywords:
                name = name.replace(keyword, "").strip()
            
            # Search for consultant by name
            consultants = suggestion_service.search_consultants_by_name(name, limit=5)
            
            if consultants:
                consultant = consultants[0]  # Get the first match
                response = f"Here's information about {consultant['name']}:\n\n"
                response += f"📧 Email: {consultant['email']}\n"
                response += f"📞 Phone: {consultant['phone']}\n"
                response += f"📍 Location: {consultant['location']}\n"
                response += f"🏢 Title: {consultant['title'] or 'Not specified'}\n"
                response += f"🎯 Practice Area: {consultant['practice_area'] or 'Not specified'}\n"
                response += f"📊 Status: {consultant['consultant_status']}\n"
                response += f"💰 Hourly Rate: ${consultant['hourly_rate_low']} - ${consultant['hourly_rate_high']}\n\n"
                
                if consultant['professional_passion']:
                    response += f"💼 Professional Passion:\n{consultant['professional_passion'][:300]}...\n\n"
                
                if consultant['projects_excite']:
                    response += f"🚀 Projects That Excite:\n{consultant['projects_excite'][:300]}...\n\n"
                
                response += "Would you like to see more details or contact this consultant?"
                
                return {
                    "response": response,
                    "consultants": [consultant],
                    "type": "specific_consultant"
                }
            else:
                return {
                    "response": f"I couldn't find a consultant named '{name}'. Please check the spelling or try searching for consultants with specific skills instead.",
                    "consultants": [],
                    "type": "not_found"
                }
        
        # Regular skill/expertise search
        consultants = suggestion_service.search_consultants(query, limit=5)
        
        if consultants:
            response = f"I found {len(consultants)} consultant(s) matching your query '{query}':\n\n"
            for i, consultant in enumerate(consultants, 1):
                response += f"{i}. **{consultant['name']}**\n"
                response += f"   📧 {consultant['email']}\n"
                response += f"   📍 {consultant['location']}\n"
                response += f"   🎯 {consultant['practice_area'] or 'General consulting'}\n"
                response += f"   💰 ${consultant['hourly_rate_low']} - ${consultant['hourly_rate_high']}/hour\n"
                response += f"   📈 Match Score: {consultant['similarity_score']:.1%}\n\n"
            
            response += "Would you like more details about any of these consultants?"
            
            return {
                "response": response,
                "consultants": consultants,
                "type": "search_results"
            }
        else:
            return {
                "response": f"I couldn't find any consultants matching '{query}'. Try searching for specific skills like 'marketing', 'finance', 'healthcare', or 'leadership'.",
                "consultants": [],
                "type": "no_results"
            }
            
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Consultant Suggestion System")
    print("=" * 45)
    
    if suggestion_service:
        stats = suggestion_service.get_database_stats()
        print(f"📊 Database Status:")
        print(f"   Total consultants: {stats.get('total_consultants', 0)}")
        print(f"   With embeddings: {stats.get('with_embeddings', 0)}")
        print(f"   Without embeddings: {stats.get('without_embeddings', 0)}")
        
        if stats.get('with_embeddings', 0) == 0:
            print("\n⚠️ No consultants with embeddings found!")
            print("💡 Run: python generate_embeddings.py")
        
        print(f"\n🌐 API Documentation: http://192.168.1.22:8000/docs")
        print(f"🔍 Test search: http://192.168.1.22:8000/search")
        print(f"💬 Chat endpoint: http://192.168.1.22:8000/chat")
        print(f"🌍 Access from other devices: http://192.168.1.22:8000")
        
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
    else:
        print("❌ Failed to initialize service")
        print("💡 Check your .env file and database connection")
