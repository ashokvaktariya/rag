-- Remove duplicate consultants, keeping only the first occurrence of each name
DELETE FROM public.consultant_profiles a
USING public.consultant_profiles b
WHERE a.id > b.id 
AND LOWER(a.name) = LOWER(b.name);

-- Now add email column with unique constraint
ALTER TABLE public.consultant_profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_email ON public.consultant_profiles(email);

-- Add constraint to prevent duplicate names (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_consultant_profiles_name_unique 
ON public.consultant_profiles (LOWER(name));

-- Update all consultants with high-resolution professional stock photos from Unsplash
UPDATE public.consultant_profiles
SET photo_url = CASE 
  WHEN LOWER(name) = 'sarah chen' THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'michael thompson' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'priya patel' THEN 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'david kim' THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'emily rodriguez' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'james wilson' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'lisa anderson' THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'robert martinez' THEN 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'nina johansson' THEN 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'anthony lee' THEN 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'rachel green' THEN 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=800&fit=crop'
  WHEN LOWER(name) = 'marcus johnson' THEN 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop'
  ELSE photo_url
END;