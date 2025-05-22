// src/components/compiler/DatatypeMappingDisplay.tsx
import type { DatatypeMapping } from "@/lib/compiler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";

interface DatatypeMappingDisplayProps {
  mappings: DatatypeMapping[];
}

export function DatatypeMappingDisplay({ mappings }: DatatypeMappingDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Info className="mr-2 h-5 w-5 text-accent" />
          Datatype Mapping (C to MiniC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>C Datatype</TableHead>
              <TableHead>MiniC Datatype</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.cType}>
                <TableCell className="font-medium font-mono">{mapping.cType}</TableCell>
                <TableCell className="font-mono">{mapping.miniCType}</TableCell>
                <TableCell>{mapping.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
