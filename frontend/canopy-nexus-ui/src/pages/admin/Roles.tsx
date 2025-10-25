import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const AdminRoles = () => {
  const roles = ["ADMIN", "BDM", "PRACTICE_LEAD", "CONSULTANT"];
  const permissions = [
    { name: "View Dashboard", admin: true, bdm: true, lead: true, consultant: false },
    { name: "Manage Users", admin: true, bdm: false, lead: false, consultant: false },
    { name: "Upload Documents", admin: true, bdm: true, lead: true, consultant: false },
    { name: "Manage Collections", admin: true, bdm: false, lead: true, consultant: false },
    { name: "Edit Prompts", admin: true, bdm: false, lead: false, consultant: false },
    { name: "Configure Models", admin: true, bdm: false, lead: false, consultant: false },
    { name: "View Chat History", admin: true, bdm: true, lead: true, consultant: false },
    { name: "Use Chat Assistant", admin: true, bdm: true, lead: true, consultant: true },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Roles & Permissions</h1>
        <p className="text-muted-foreground">Configure access control for different user roles</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Manage what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Permission</TableHead>
                {roles.map((role) => (
                  <TableHead key={role} className="text-center">
                    {role.replace("_", " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={permission.admin} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={permission.bdm} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={permission.lead} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={permission.consultant} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <Button className="rounded-lg">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoles;
