-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create consultant profiles table
CREATE TABLE public.consultant_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL,
  expertise text[] NOT NULL,
  years_experience integer NOT NULL,
  photo_url text,
  bio text,
  skills text[],
  certifications text[],
  availability_status text DEFAULT 'available',
  hourly_rate numeric(10,2),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultant_profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read profiles (for chat RAG)
CREATE POLICY "Anyone can view consultant profiles"
  ON public.consultant_profiles
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update profiles
CREATE POLICY "Authenticated users can insert profiles"
  ON public.consultant_profiles
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update profiles"
  ON public.consultant_profiles
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_consultant_profiles_updated_at
  BEFORE UPDATE ON public.consultant_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample consultant profiles
INSERT INTO public.consultant_profiles (name, title, expertise, years_experience, photo_url, bio, skills, certifications, availability_status, hourly_rate) VALUES
-- Finance consultants
('Sarah Chen', 'Senior Financial Strategist', ARRAY['finance', 'strategic advisory'], 12, 'https://i.pravatar.cc/300?img=1', 'Expert in corporate finance, M&A strategy, and financial restructuring with Fortune 500 experience.', ARRAY['Financial Modeling', 'M&A', 'Risk Management', 'Capital Markets', 'Due Diligence'], ARRAY['CFA', 'MBA Finance'], 'available', 350.00),
('Michael Thompson', 'Investment Banking Advisor', ARRAY['finance', 'business'], 15, 'https://i.pravatar.cc/300?img=12', 'Former VP at Goldman Sachs specializing in deal structuring and capital raising for mid-market companies.', ARRAY['Investment Banking', 'Private Equity', 'Valuation', 'Deal Structuring'], ARRAY['CFA', 'Series 7 & 63'], 'available', 425.00),
('Priya Patel', 'CFO Advisory Consultant', ARRAY['finance', 'strategic advisory'], 10, 'https://i.pravatar.cc/300?img=5', 'Helps startups and growth companies build financial infrastructure and prepare for Series A/B funding.', ARRAY['Financial Planning', 'FP&A', 'Fundraising', 'Board Advisory'], ARRAY['CPA', 'MBA'], 'busy', 300.00),

-- Technology consultants
('David Kim', 'Enterprise Cloud Architect', ARRAY['technology'], 14, 'https://i.pravatar.cc/300?img=13', 'Specializes in cloud migration strategies and enterprise architecture for large-scale transformations.', ARRAY['AWS', 'Azure', 'Cloud Architecture', 'DevOps', 'Kubernetes'], ARRAY['AWS Solutions Architect Professional', 'TOGAF'], 'available', 280.00),
('Emily Rodriguez', 'AI/ML Strategy Consultant', ARRAY['technology', 'strategic advisory'], 8, 'https://i.pravatar.cc/300?img=9', 'Guides organizations in implementing AI solutions and building data science capabilities.', ARRAY['Machine Learning', 'AI Strategy', 'Python', 'Data Science', 'MLOps'], ARRAY['PhD Computer Science', 'Google Cloud ML Engineer'], 'available', 320.00),
('James Wilson', 'Cybersecurity & Risk Advisor', ARRAY['technology', 'business'], 11, 'https://i.pravatar.cc/300?img=15', 'Former CISO with expertise in security architecture, compliance, and incident response planning.', ARRAY['Security Architecture', 'Compliance', 'Risk Assessment', 'GDPR', 'SOC 2'], ARRAY['CISSP', 'CISM'], 'available', 340.00),

-- Business & Strategic Advisory
('Lisa Anderson', 'Digital Transformation Lead', ARRAY['business', 'strategic advisory', 'technology'], 13, 'https://i.pravatar.cc/300?img=20', 'Drives organization-wide digital transformation initiatives combining technology and change management.', ARRAY['Digital Strategy', 'Change Management', 'Agile Transformation', 'Process Optimization'], ARRAY['PMP', 'SAFe SPC'], 'available', 310.00),
('Robert Martinez', 'Market Entry Strategist', ARRAY['business', 'strategic advisory'], 16, 'https://i.pravatar.cc/300?img=33', 'Helps companies expand into new markets with competitive analysis and go-to-market strategies.', ARRAY['Market Research', 'Competitive Analysis', 'GTM Strategy', 'Business Development'], ARRAY['MBA Strategy', 'Six Sigma Black Belt'], 'available', 290.00),
('Nina Johansson', 'Operational Excellence Consultant', ARRAY['business', 'strategic advisory'], 9, 'https://i.pravatar.cc/300?img=26', 'Optimizes business operations and implements lean methodologies for manufacturing and service companies.', ARRAY['Lean Six Sigma', 'Process Improvement', 'Supply Chain', 'Operations Management'], ARRAY['Six Sigma Master Black Belt', 'APICS'], 'available', 270.00),
('Anthony Lee', 'Growth Strategy Advisor', ARRAY['business', 'strategic advisory', 'finance'], 12, 'https://i.pravatar.cc/300?img=51', 'Former McKinsey consultant specializing in growth strategies, pricing optimization, and revenue models.', ARRAY['Strategy Consulting', 'Pricing Strategy', 'Revenue Optimization', 'Business Model Innovation'], ARRAY['MBA Harvard', 'Certified Strategy Professional'], 'busy', 400.00),

-- Additional specialized profiles
('Rachel Green', 'Sustainability & ESG Advisor', ARRAY['strategic advisory', 'business'], 7, 'https://i.pravatar.cc/300?img=24', 'Guides companies in developing ESG strategies and sustainability reporting frameworks.', ARRAY['ESG Strategy', 'Sustainability Reporting', 'Carbon Accounting', 'Impact Assessment'], ARRAY['GRI Certified', 'SASB FSA'], 'available', 260.00),
('Marcus Johnson', 'Private Equity Portfolio Advisor', ARRAY['finance', 'strategic advisory', 'business'], 14, 'https://i.pravatar.cc/300?img=60', 'Works with PE firms and portfolio companies on value creation initiatives and operational improvements.', ARRAY['Value Creation', 'Portfolio Management', 'Due Diligence', 'Exit Strategy'], ARRAY['CFA', 'MBA Wharton'], 'available', 380.00);