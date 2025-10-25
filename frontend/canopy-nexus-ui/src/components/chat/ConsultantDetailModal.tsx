import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Star, 
  User, 
  Calendar,
  ExternalLink,
  X,
  Loader2
} from "lucide-react";

export interface Consultant {
  id: string;
  consultant_id?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  home_phone?: string;
  other_phone?: string;
  fax?: string;
  contact_type?: string;
  consultant_status?: string;
  contact_owner?: string;
  lead_source?: string;
  consultant_lead_source?: string;
  account_name?: string;
  title?: string;
  department?: string;
  mailing_street?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_zip?: string;
  mailing_country?: string;
  location?: string;
  practice_area?: string;
  hourly_rate_low?: string;
  hourly_rate_high?: string;
  hourly_rate_range?: string;
  business_strategy_skills?: string;
  finance_skills?: string;
  law_skills?: string;
  marketing_pr_skills?: string;
  nonprofit_skills?: string;
  professional_passion?: string;
  projects_excite?: string;
  open_to_fulltime?: string;
  how_heard_about_us?: string;
  referred_by?: string;
  professional_reference_1_name?: string;
  professional_reference_1_organization?: string;
  professional_reference_1_title?: string;
  professional_reference_1_email?: string;
  professional_reference_1_phone?: string;
  professional_reference_1_notes?: string;
  professional_reference_2_name?: string;
  professional_reference_2_organization?: string;
  professional_reference_2_title?: string;
  professional_reference_2_email?: string;
  professional_reference_2_phone?: string;
  professional_reference_2_notes?: string;
  description?: string;
  interview_notes?: string;
  reference_call_notes?: string;
  keywords?: string;
  linkedin?: string;
  linkedin_connection?: string;
  invitation_lists?: string;
  created_time?: string;
  modified_time?: string;
  last_activity_time?: string;
  extracted_at?: string;
  zoho_data?: any;
  rate?: string;
  similarity?: number;
  skills?: string;
  experience?: string;
  availability?: string;
}

interface ConsultantDetailModalProps {
  consultant: Consultant | null;
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ConsultantDetailModal({ 
  consultant, 
  isOpen, 
  onClose 
}: ConsultantDetailModalProps) {
  const [fullConsultantData, setFullConsultantData] = useState<Consultant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch complete consultant data when modal opens
  useEffect(() => {
    if (isOpen && consultant?.id) {
      fetchFullConsultantData(consultant.id);
    }
  }, [isOpen, consultant?.id]);

  const fetchFullConsultantData = async (consultantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/consultant/${consultantId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch consultant data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFullConsultantData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consultant data');
      console.error('Error fetching consultant data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = () => {
    if (fullConsultantData?.email) {
      window.open(`mailto:${fullConsultantData.email}`, '_blank');
    }
  };

  const handleProfileClick = () => {
    // For now, we'll just copy the consultant info to clipboard
    if (fullConsultantData) {
      const profileText = `
Consultant Profile:
Name: ${fullConsultantData.name}
Email: ${fullConsultantData.email}
Phone: ${fullConsultantData.phone || 'N/A'}
Title: ${fullConsultantData.title || 'N/A'}
Location: ${fullConsultantData.location || 'N/A'}
Practice Area: ${fullConsultantData.practice_area || 'N/A'}
Status: ${fullConsultantData.consultant_status || 'N/A'}
Rate: ${fullConsultantData.hourly_rate_low ? `$${fullConsultantData.hourly_rate_low}-${fullConsultantData.hourly_rate_high}/hr` : 'N/A'}
      `.trim();
      
      navigator.clipboard.writeText(profileText).then(() => {
        alert('Consultant profile copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy profile to clipboard');
      });
    }
  };

  if (!consultant) return null;

  // Use full data if available, otherwise fall back to basic consultant data
  const displayData = fullConsultantData || consultant;

  const initials = displayData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColor = displayData.consultant_status === "Active" 
    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" 
    : displayData.consultant_status === "In Vetting"
    ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
    : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";

  const getSkillsArray = () => {
    const skills = [];
    if (displayData.business_strategy_skills) skills.push({ label: "Business Strategy", value: displayData.business_strategy_skills });
    if (displayData.finance_skills) skills.push({ label: "Finance", value: displayData.finance_skills });
    if (displayData.law_skills) skills.push({ label: "Legal", value: displayData.law_skills });
    if (displayData.marketing_pr_skills) skills.push({ label: "Marketing & PR", value: displayData.marketing_pr_skills });
    if (displayData.nonprofit_skills) skills.push({ label: "Nonprofit", value: displayData.nonprofit_skills });
    return skills;
  };

  const skills = getSkillsArray();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">Consultant Profile</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Loading consultant details...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchFullConsultantData(consultant.id)}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 p-6 bg-muted/50 rounded-lg">
            <Avatar className="w-20 h-20">
              <AvatarImage src={undefined} alt={displayData.name} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {displayData.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-3">
                    {displayData.title || 'Consultant'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant="outline" className={statusColor}>
                    {displayData.consultant_status || 'Unknown'}
                  </Badge>
                  {displayData.similarity && (
                    <Badge variant="secondary" className="text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {(displayData.similarity * 100).toFixed(1)}% match
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complete Contact Information */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Complete Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {displayData.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <a href={`mailto:${displayData.email}`} className="text-primary hover:underline">
                    {displayData.email}
                  </a>
                </div>
              )}
              {displayData.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <a href={`tel:${displayData.phone}`} className="text-primary hover:underline">
                    {displayData.phone}
                  </a>
                </div>
              )}
              {displayData.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Mobile:</span>
                  <a href={`tel:${displayData.mobile}`} className="text-primary hover:underline">
                    {displayData.mobile}
                  </a>
                </div>
              )}
              {displayData.home_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Home Phone:</span>
                  <span>{displayData.home_phone}</span>
                </div>
              )}
              {displayData.fax && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Fax:</span>
                  <span>{displayData.fax}</span>
                </div>
              )}
              {displayData.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{displayData.location}</span>
                </div>
              )}
              {(displayData.hourly_rate_low || displayData.rate) && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Rate:</span>
                  <span className="font-semibold text-green-600">
                    {displayData.rate || (displayData.hourly_rate_low ? `$${displayData.hourly_rate_low}-${displayData.hourly_rate_high}/hr` : 'N/A')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Complete Address Information */}
          {(displayData.mailing_street || displayData.mailing_city || displayData.mailing_state || displayData.mailing_zip || displayData.mailing_country) && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Complete Address</h3>
              </div>
              <div className="text-sm space-y-2">
                {displayData.mailing_street && <p><span className="font-medium">Street:</span> {displayData.mailing_street}</p>}
                {displayData.mailing_city && <p><span className="font-medium">City:</span> {displayData.mailing_city}</p>}
                {displayData.mailing_state && <p><span className="font-medium">State:</span> {displayData.mailing_state}</p>}
                {displayData.mailing_zip && <p><span className="font-medium">ZIP:</span> {displayData.mailing_zip}</p>}
                {displayData.mailing_country && <p><span className="font-medium">Country:</span> {displayData.mailing_country}</p>}
              </div>
            </div>
          )}

          {/* Professional Information */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Professional Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {displayData.title && <p><span className="font-medium">Title:</span> {displayData.title}</p>}
              {displayData.department && <p><span className="font-medium">Department:</span> {displayData.department}</p>}
              {displayData.practice_area && <p><span className="font-medium">Practice Area:</span> {displayData.practice_area}</p>}
              {displayData.contact_type && <p><span className="font-medium">Contact Type:</span> {displayData.contact_type}</p>}
              {displayData.account_name && <p><span className="font-medium">Account Name:</span> {displayData.account_name}</p>}
              {displayData.contact_owner && <p><span className="font-medium">Contact Owner:</span> {displayData.contact_owner}</p>}
            </div>
          </div>

          {/* Skills & Expertise */}
          {skills.length > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Skills & Expertise</h3>
              </div>
              <div className="space-y-4">
                {displayData.business_strategy_skills && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-1">Business Strategy</h4>
                    <p className="text-sm text-muted-foreground">{displayData.business_strategy_skills}</p>
                  </div>
                )}
                {displayData.finance_skills && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-1">Finance</h4>
                    <p className="text-sm text-muted-foreground">{displayData.finance_skills}</p>
                  </div>
                )}
                {displayData.law_skills && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-1">Legal</h4>
                    <p className="text-sm text-muted-foreground">{displayData.law_skills}</p>
                  </div>
                )}
                {displayData.marketing_pr_skills && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-1">Marketing & PR</h4>
                    <p className="text-sm text-muted-foreground">{displayData.marketing_pr_skills}</p>
                  </div>
                )}
                {displayData.nonprofit_skills && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-1">Nonprofit</h4>
                    <p className="text-sm text-muted-foreground">{displayData.nonprofit_skills}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional References */}
          {(displayData.professional_reference_1_name || displayData.professional_reference_2_name) && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Professional References</h3>
              </div>
              <div className="space-y-4">
                {displayData.professional_reference_1_name && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-2">Reference 1</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Name:</span> {displayData.professional_reference_1_name}</p>
                      {displayData.professional_reference_1_organization && <p><span className="font-medium">Organization:</span> {displayData.professional_reference_1_organization}</p>}
                      {displayData.professional_reference_1_title && <p><span className="font-medium">Title:</span> {displayData.professional_reference_1_title}</p>}
                      {displayData.professional_reference_1_email && <p><span className="font-medium">Email:</span> {displayData.professional_reference_1_email}</p>}
                      {displayData.professional_reference_1_phone && <p><span className="font-medium">Phone:</span> {displayData.professional_reference_1_phone}</p>}
                      {displayData.professional_reference_1_notes && <p><span className="font-medium">Notes:</span> {displayData.professional_reference_1_notes}</p>}
                    </div>
                  </div>
                )}
                {displayData.professional_reference_2_name && (
                  <div className="border-l-4 border-primary/20 pl-4">
                    <h4 className="font-semibold text-primary mb-2">Reference 2</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Name:</span> {displayData.professional_reference_2_name}</p>
                      {displayData.professional_reference_2_organization && <p><span className="font-medium">Organization:</span> {displayData.professional_reference_2_organization}</p>}
                      {displayData.professional_reference_2_title && <p><span className="font-medium">Title:</span> {displayData.professional_reference_2_title}</p>}
                      {displayData.professional_reference_2_email && <p><span className="font-medium">Email:</span> {displayData.professional_reference_2_email}</p>}
                      {displayData.professional_reference_2_phone && <p><span className="font-medium">Phone:</span> {displayData.professional_reference_2_phone}</p>}
                      {displayData.professional_reference_2_notes && <p><span className="font-medium">Notes:</span> {displayData.professional_reference_2_notes}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onboarding & Background Information */}
          {(displayData.how_heard_about_us || displayData.referred_by || displayData.open_to_fulltime || displayData.lead_source) && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Onboarding & Background</h3>
              </div>
              <div className="text-sm space-y-2">
                {displayData.how_heard_about_us && <p><span className="font-medium">How heard about us:</span> {displayData.how_heard_about_us}</p>}
                {displayData.referred_by && <p><span className="font-medium">Referred by:</span> {displayData.referred_by}</p>}
                {displayData.open_to_fulltime && <p><span className="font-medium">Open to fulltime:</span> {displayData.open_to_fulltime}</p>}
                {displayData.lead_source && <p><span className="font-medium">Lead source:</span> {displayData.lead_source}</p>}
                {displayData.consultant_lead_source && <p><span className="font-medium">Consultant lead source:</span> {displayData.consultant_lead_source}</p>}
                {displayData.contact_owner && <p><span className="font-medium">Contact owner:</span> {displayData.contact_owner}</p>}
              </div>
            </div>
          )}

          {/* Interview & Reference Notes */}
          {(displayData.interview_notes || displayData.reference_call_notes) && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Interview & Reference Notes</h3>
              </div>
              <div className="space-y-4">
                {displayData.interview_notes && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Interview Notes</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{displayData.interview_notes}</p>
                  </div>
                )}
                {displayData.reference_call_notes && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Reference Call Notes</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{displayData.reference_call_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LinkedIn & Social Information */}
          {(displayData.linkedin || displayData.linkedin_connection) && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">LinkedIn & Social</h3>
              </div>
              <div className="text-sm space-y-2">
                {displayData.linkedin && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">LinkedIn:</span>
                    <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {displayData.linkedin}
                    </a>
                  </div>
                )}
                {displayData.linkedin_connection && <p><span className="font-medium">LinkedIn Connection:</span> {displayData.linkedin_connection}</p>}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">System Information</h3>
            </div>
            <div className="text-sm space-y-2">
              {displayData.created_time && <p><span className="font-medium">Created:</span> {new Date(displayData.created_time).toLocaleDateString()}</p>}
              {displayData.modified_time && <p><span className="font-medium">Last Modified:</span> {new Date(displayData.modified_time).toLocaleDateString()}</p>}
              {displayData.last_activity_time && <p><span className="font-medium">Last Activity:</span> {new Date(displayData.last_activity_time).toLocaleDateString()}</p>}
              {displayData.extracted_at && <p><span className="font-medium">Data Extracted:</span> {new Date(displayData.extracted_at).toLocaleDateString()}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={handleContactClick}
              disabled={!displayData.email}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Consultant
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={handleProfileClick}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy Profile
            </Button>
          </div>

        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
