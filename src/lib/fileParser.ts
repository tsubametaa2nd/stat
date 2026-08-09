import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedData {
  data: Record<string, number>[];
  variables: string[];
  rowCount: number;
}

export interface ParseError {
  message: string;
  details?: string;
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, any>[];
          const validatedData = validateAndConvertData(data);
          resolve(validatedData);
        } catch (error) {
          reject({
            message: "Error parsing CSV",
            details: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
      error: (error) => {
        reject({
          message: "Failed to parse CSV file",
          details: error.message,
        });
      },
    });
  });
}

/**
 * Parse JSON file
 */
export function parseJSON(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);

        // Handle both array and object with data property
        const data = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (!Array.isArray(data)) {
          throw new Error(
            'JSON must be an array or contain a "data" array property',
          );
        }

        const validatedData = validateAndConvertData(data);
        resolve(validatedData);
      } catch (error) {
        reject({
          message: "Error parsing JSON",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    reader.onerror = () => {
      reject({
        message: "Failed to read JSON file",
        details: reader.error?.message,
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Parse XLSX file
 */
export function parseXLSX(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validatedData = validateAndConvertData(
          jsonData as Record<string, any>[],
        );
        resolve(validatedData);
      } catch (error) {
        reject({
          message: "Error parsing XLSX",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    reader.onerror = () => {
      reject({
        message: "Failed to read XLSX file",
        details: reader.error?.message,
      });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Validate and convert data to proper format
 */
function validateAndConvertData(data: Record<string, any>[]): ParsedData {
  if (!data || data.length === 0) {
    throw new Error("No data found in file");
  }

  // Get all unique column names
  const allKeys = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => allKeys.add(key));
  });

  // Filter out common ID/index columns that shouldn't be analyzed
  const excludedColumns = [
    "NO",
    "no",
    "No",
    "ID",
    "id",
    "Id",
    "INDEX",
    "index",
    "Index",
    "#",
    "Number",
    "number",
    "NAMA",
    "Nama",
    "nama",
    "KELAS",
    "Kelas",
    "kelas",
    "NIS",
    "Nis",
    "nis"
  ];
  const variables = Array.from(allKeys).filter(
    (key) => !excludedColumns.includes(key),
  );

  if (variables.length === 0) {
    throw new Error("No data columns found. Only ID/index columns detected.");
  }

  // Convert all values to numbers and validate
  const convertedData: Record<string, number>[] = [];
  const errors: string[] = [];

  data.forEach((row, index) => {
    const convertedRow: Record<string, number> = {};
    let hasValidData = false;

    variables.forEach((variable) => {
      const value = row[variable];

      if (value === null || value === undefined || value === "") {
        // Skip empty values
        return;
      }

      const numValue = Number(value);

      if (isNaN(numValue)) {
        errors.push(
          `Row ${index + 1}, Column "${variable}": "${value}" is not a valid number`,
        );
      } else {
        convertedRow[variable] = numValue;
        hasValidData = true;
      }
    });

    if (hasValidData) {
      convertedData.push(convertedRow);
    }
  });

  if (convertedData.length === 0) {
    throw new Error(
      "No valid numeric data found. Please ensure your file contains numeric values.",
    );
  }

  if (errors.length > 5) {
    throw new Error(
      `Found ${errors.length} invalid values. First few: ${errors.slice(0, 3).join("; ")}`,
    );
  }

  return {
    data: convertedData,
    variables,
    rowCount: convertedData.length,
  };
}

/**
 * Main parser function that detects file type and parses accordingly
 */
export async function parseFile(file: File): Promise<ParsedData> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "csv":
      return parseCSV(file);
    case "json":
      return parseJSON(file);
    case "xlsx":
    case "xls":
      return parseXLSX(file);
    default:
      throw {
        message: "Unsupported file format",
        details: `File type ".${extension}" is not supported. Please use CSV, JSON, or XLSX files.`,
      };
  }
}

/**
 * Generate sample data for download
 */
export function generateSampleCSV(): string {
  const headers = ["Usability", "UI/UX", "Speed", "Features", "Satisfaction"];
  const rows = [
    [5, 4, 3, 4, 4],
    [4, 3, 2, 5, 4],
    [5, 4, 3, 4, 5],
    [4, 4, 3, 3, 4],
    [5, 3, 4, 5, 4],
  ];

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );

  return csv;
}

export function downloadSampleFile(format: "csv" | "json" | "xlsx") {
  const sampleData = [
    { Usability: 5, "UI/UX": 4, Speed: 3, Features: 4, Satisfaction: 4 },
    { Usability: 4, "UI/UX": 3, Speed: 2, Features: 5, Satisfaction: 4 },
    { Usability: 5, "UI/UX": 4, Speed: 3, Features: 4, Satisfaction: 5 },
    { Usability: 4, "UI/UX": 4, Speed: 3, Features: 3, Satisfaction: 4 },
    { Usability: 5, "UI/UX": 3, Speed: 4, Features: 5, Satisfaction: 4 },
  ];

  let blob: Blob;
  let filename: string;

  switch (format) {
    case "csv":
      const csv = generateSampleCSV();
      blob = new Blob([csv], { type: "text/csv" });
      filename = "sample-data.csv";
      break;

    case "json":
      const json = JSON.stringify(sampleData, null, 2);
      blob = new Blob([json], { type: "application/json" });
      filename = "sample-data.json";
      break;

    case "xlsx":
      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      const buf = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xff;
      }

      blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      filename = "sample-data.xlsx";
      break;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
