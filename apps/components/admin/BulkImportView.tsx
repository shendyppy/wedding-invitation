// ============================================================
// Bulk Import View Component
// Paste tab-separated guest data from Excel and import in bulk
// ============================================================

"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  Copy,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "./ui";
import { Badge } from "./ui";

interface ParsedGuest {
  name: string;
  maxQuota: number;
  valid: boolean;
  error?: string;
}

interface ImportedGuest {
  id: string;
  name: string;
  maxQuota: number;
  uniqueToken: string;
}

interface BulkImportViewProps {
  onBack: () => void;
  onImportComplete: () => void;
  authToken: string;
}

export function BulkImportView({
  onBack,
  onImportComplete,
  authToken,
}: BulkImportViewProps) {
  const [rawText, setRawText] = useState("");
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportedGuest[] | null>(
    null,
  );
  const [importError, setImportError] = useState<string | null>(null);

  const parseText = useCallback(() => {
    const lines = rawText
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");

    const guests: ParsedGuest[] = lines.map((line) => {
      // Support tab-separated or comma-separated
      const parts = line.includes("\t") ? line.split("\t") : line.split(",");

      const name = parts[0]?.trim() || "";
      const quotaStr = parts[1]?.trim() || "1";
      const maxQuota = parseInt(quotaStr, 10);

      if (!name) {
        return { name: "", maxQuota: 1, valid: false, error: "Empty name" };
      }

      if (isNaN(maxQuota) || maxQuota < 1) {
        return {
          name,
          maxQuota: 1,
          valid: false,
          error: "Invalid quota number",
        };
      }

      return { name, maxQuota, valid: true };
    });

    setParsedGuests(guests);
    setIsParsed(true);
  }, [rawText]);

  const removeGuest = (index: number) => {
    setParsedGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    const validGuests = parsedGuests.filter((g) => g.valid);
    if (validGuests.length === 0) return;

    setImporting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/admin/guests/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          guests: validGuests.map((g) => ({
            name: g.name,
            maxQuota: g.maxQuota,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setImportResults(data.data);
        onImportComplete();
      } else {
        setImportError(data.error || "Import failed");
      }
    } catch (error) {
      setImportError("Failed to connect to server");
    } finally {
      setImporting(false);
    }
  };

  const copyAllLinks = () => {
    if (!importResults) return;
    const links = importResults
      .map(
        (g) => `${g.name}\t${window.location.origin}/invite/${g.uniqueToken}`,
      )
      .join("\n");
    navigator.clipboard.writeText(links);
  };

  const copyLink = (guest: ImportedGuest) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/invite/${guest.uniqueToken}`,
    );
  };

  const validCount = parsedGuests.filter((g) => g.valid).length;
  const invalidCount = parsedGuests.filter((g) => !g.valid).length;

  // Show results after import
  if (importResults) {
    return (
      <div className="space-y-6 admin-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-admin-text font-display">
              Import Complete! 🎉
            </h2>
            <p className="text-sm text-admin-text-muted">
              {importResults.length} guests imported successfully
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyAllLinks} className="gap-2">
              <Copy className="w-4 h-4" />
              Copy All Links
            </Button>
            <Button onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Guests
            </Button>
          </div>
        </div>

        <div className="admin-fade-in admin-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto admin-scroll">
            <table className="w-full">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                    #
                  </th>
                  <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                    Guest Name
                  </th>
                  <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                    Quota
                  </th>
                  <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                    Invite Link
                  </th>
                  <th className="text-right p-4 font-medium text-sm text-admin-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {importResults.map((guest, i) => (
                  <tr
                    key={guest.id}
                    className="border-b border-admin-border hover:bg-admin-surface-hover/50 transition-colors"
                  >
                    <td className="p-4 text-sm text-admin-text-muted">
                      {i + 1}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-admin-text">
                        {guest.name}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{guest.maxQuota}</Badge>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-admin-text-muted font-mono">
                        /invite/{guest.uniqueToken}
                      </code>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyLink(guest)}
                        className="gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-admin-text font-display">
            Bulk Import Guests
          </h2>
          <p className="text-sm text-admin-text-muted">
            Paste your guest list from Excel (tab-separated or comma-separated)
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {!isParsed ? (
        /* Input Phase */
        <div className="space-y-4">
          {/* Instructions */}
          <div className="admin-fade-in admin-surface rounded-xl p-5">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-admin-accent mt-0.5" />
              <div className="space-y-2 text-sm text-admin-text-muted">
                <p className="text-admin-text font-medium">
                  How to paste from Excel:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Select your guest data in Excel (Name column + Jumlah
                    Undangan column)
                  </li>
                  <li>Copy (Ctrl+C / Cmd+C)</li>
                  <li>Paste into the text area below (Ctrl+V / Cmd+V)</li>
                </ol>
                <p className="text-xs">
                  Format: <code>Nama Undangan [TAB] Jumlah Undangan</code>
                  <br />
                  Example: <code>Ko Along & Keluarga → 2</code>
                </p>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full h-64 rounded-xl border border-admin-border bg-admin-surface px-4 py-3 text-sm text-admin-text font-mono focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent placeholder:text-admin-text-muted resize-y transition-all"
            placeholder={`Cici Lita\t1\nCici Lisan & Ko Chandra\t2\nKo Along & Keluarga\t2\n...`}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-admin-text-muted">
              {rawText.trim().split("\n").filter(Boolean).length} lines detected
            </p>
            <Button
              onClick={parseText}
              disabled={!rawText.trim()}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Parse Data
            </Button>
          </div>
        </div>
      ) : (
        /* Preview Phase */
        <div className="space-y-4">
          {/* Summary badges */}
          <div className="flex items-center gap-3">
            <Badge variant="success" className="gap-1">
              <Check className="w-3 h-3" />
              {validCount} valid
            </Badge>
            {invalidCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                {invalidCount} invalid
              </Badge>
            )}
            <span className="text-xs text-admin-text-muted">
              Total quota:{" "}
              {parsedGuests
                .filter((g) => g.valid)
                .reduce((sum, g) => sum + g.maxQuota, 0)}{" "}
              invitations
            </span>
          </div>

          {importError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {importError}
            </div>
          )}

          {/* Preview Table */}
          <div className="admin-fade-in admin-surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto admin-scroll max-h-96">
              <table className="w-full">
                <thead className="sticky top-0 bg-admin-surface">
                  <tr className="border-b border-admin-border">
                    <th className="text-left p-3 font-medium text-sm text-admin-text-muted w-12">
                      #
                    </th>
                    <th className="text-left p-3 font-medium text-sm text-admin-text-muted">
                      Guest Name (Dear ...)
                    </th>
                    <th className="text-left p-3 font-medium text-sm text-admin-text-muted w-24">
                      Quota
                    </th>
                    <th className="text-left p-3 font-medium text-sm text-admin-text-muted w-24">
                      Status
                    </th>
                    <th className="text-right p-3 font-medium text-sm text-admin-text-muted w-16" />
                  </tr>
                </thead>
                <tbody>
                  {parsedGuests.map((guest, i) => (
                    <tr
                      key={i}
                      className={`border-b border-admin-border transition-colors ${
                        guest.valid
                          ? "hover:bg-admin-surface-hover/50"
                          : "bg-red-500/5"
                      }`}
                    >
                      <td className="p-3 text-xs text-admin-text-muted">
                        {i + 1}
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-admin-text">
                          {guest.name || (
                            <span className="text-red-400 italic">Empty</span>
                          )}
                        </p>
                        {guest.valid && (
                          <p className="text-xs text-admin-text-muted mt-0.5">
                            Dear, {guest.name}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={guest.valid ? "outline" : "destructive"}
                        >
                          {guest.maxQuota}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {guest.valid ? (
                          <Badge variant="success">
                            <Check className="w-3 h-3" />
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            {guest.error}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => removeGuest(i)}
                          className="p-1.5 rounded-lg text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsParsed(false);
                setParsedGuests([]);
              }}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Re-edit
            </Button>
            <Button
              onClick={handleImport}
              disabled={validCount === 0 || importing}
              className="gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing {validCount} guests...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import {validCount} Guests
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
