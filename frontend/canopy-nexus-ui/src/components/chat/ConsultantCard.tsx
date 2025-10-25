import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Mail, MapPin, TrendingUp, Phone, Briefcase, Star, User } from "lucide-react";
import { useState } from "react";

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

interface ConsultantCardProps {
  consultant: Consultant;
  onConsultantClick?: (consultant: Consultant) => void;
}

export default function ConsultantCard({ consultant, onConsultantClick }: ConsultantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const initials = consultant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColor = consultant.consultant_status === "Active" 
    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" 
    : consultant.consultant_status === "In Vetting"
    ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
    : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";

  const getSkillsArray = () => {
    const skills = [];
    if (consultant.business_strategy_skills) skills.push({ label: "Business Strategy", value: consultant.business_strategy_skills });
    if (consultant.finance_skills) skills.push({ label: "Finance", value: consultant.finance_skills });
    if (consultant.law_skills) skills.push({ label: "Legal", value: consultant.law_skills });
    if (consultant.marketing_pr_skills) skills.push({ label: "Marketing & PR", value: consultant.marketing_pr_skills });
    if (consultant.nonprofit_skills) skills.push({ label: "Nonprofit", value: consultant.nonprofit_skills });
    return skills;
  };

  const skills = getSkillsArray();

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={() => onConsultantClick?.(consultant)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={undefined} alt={consultant.name} />
              <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{consultant.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{consultant.title || 'Consultant'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className={statusColor}>
              {consultant.consultant_status || 'Unknown'}
            </Badge>
            {consultant.similarity && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {(consultant.similarity * 100).toFixed(1)}% match
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {consultant.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{consultant.email}</span>
            </div>
          )}
          {consultant.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{consultant.phone}</span>
            </div>
          )}
          {consultant.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{consultant.location}</span>
            </div>
          )}
          {consultant.rate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>{consultant.rate}</span>
            </div>
          )}
        </div>

        {/* Practice Area */}
        {consultant.practice_area && (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Practice Area:</span>
            <Badge variant="outline">{consultant.practice_area}</Badge>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Expertise Areas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, isExpanded ? skills.length : 3).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill.label}
                </Badge>
              ))}
              {skills.length > 3 && !isExpanded && (
                <Badge variant="secondary" className="text-xs">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Professional Passion */}
        {consultant.professional_passion && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Professional Passion:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {consultant.professional_passion}
            </p>
          </div>
        )}

        {/* Projects That Excite */}
        {consultant.projects_excite && isExpanded && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Projects That Excite:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {consultant.projects_excite}
            </p>
          </div>
        )}

        {/* Description */}
        {consultant.description && isExpanded && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Description:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {consultant.description}
            </p>
          </div>
        )}

        {/* Keywords */}
        {consultant.keywords && isExpanded && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Keywords:</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {consultant.keywords}
            </p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {(consultant.projects_excite || consultant.description || consultant.keywords) && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full"
            >
              {isExpanded ? 'Show Less' : 'Show More Details'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
