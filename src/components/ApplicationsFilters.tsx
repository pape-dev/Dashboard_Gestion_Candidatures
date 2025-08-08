
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SortAsc, SortDesc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  selectedApps: string[];
  handleSelectAll: () => void;
  totalApplications: number;
}

const ApplicationsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedApps,
  handleSelectAll,
  totalApplications,
}: ApplicationsFiltersProps) => {
  return (
    <>
      <Card className="bg-white shadow-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par entreprise, poste ou compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48 border-2 focus:border-blue-500">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-xl border-0 rounded-xl">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Entretien">Entretien</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Accepté">Accepté</SelectItem>
                  <SelectItem value="Refusé">Refusé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-2 focus:border-blue-500">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-xl border-0 rounded-xl">
                  <SelectItem value="created_at">Date de candidature</SelectItem>
                  <SelectItem value="company">Entreprise</SelectItem>
                  <SelectItem value="salary_min">Salaire</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            {selectedApps.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">{selectedApps.length} sélectionnée(s)</span>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-300">
                  Actions groupées
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {totalApplications > 0 && (
        <div className="flex items-center gap-4 py-2">
          <Checkbox
            checked={selectedApps.length === totalApplications}
            onCheckedChange={handleSelectAll}
            className="border-2"
          />
          <span className="text-sm text-gray-600">
            Sélectionner tout ({totalApplications} candidatures)
          </span>
        </div>
      )}
    </>
  );
};

export default ApplicationsFilters;
