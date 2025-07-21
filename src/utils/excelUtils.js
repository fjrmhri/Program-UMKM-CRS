import ExcelJS from "exceljs";
import Papa from "papaparse";

export async function parseExcel(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (["xlsx", "xls"].includes(ext)) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await file.arrayBuffer());
    const ws = wb.worksheets[0];
    const data = [];

    ws.eachRow((row, idx) => {
      if (idx === 1) return;
      const [nama, desa, posyandu, pre, post] = row.values.slice(1);
      data.push({
        nama,
        desa: desa || "",
        posyandu: posyandu || "",
        pre: Number(pre),
        post: Number(post),
      });
    });

    if (!data.length) throw new Error("Data kosong!");
    return data;
  }

  if (ext === "csv") {
    const text = await file.text();
    const res = Papa.parse(text, { header: true });
    const data = res.data.map((row) => ({
      nama: row.Nama || "",
      desa: row["Nama Desa"] || "",
      posyandu: row["Nama Posyandu"] || "",
      pre: Number(row["Nilai Pre Test"]),
      post: Number(row["Nilai Post Test"]),
    }));
    if (!data.length) throw new Error("Data kosong!");
    return data;
  }

  throw new Error("Format hanya .xlsx atau .csv");
}

export function computeStats(data) {
  const total = data.length;
  const sumPre = data.reduce((acc, cur) => acc + cur.pre, 0);
  const sumPost = data.reduce((acc, cur) => acc + cur.post, 0);
  const avgPre = sumPre / total;
  const avgPost = sumPost / total;
  const peningkatan = ((avgPost - avgPre) / avgPre) * 100;
  const paham = data.filter((d) => d.post >= 70).length;
  const selisih = avgPost - avgPre;

  return { total, avgPre, avgPost, peningkatan, paham, selisih };
}

export async function parseExcelMSE(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["xlsx", "xls"].includes(ext))
    throw new Error("File harus .xlsx atau .xls");

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const ws = wb.worksheets[0];

  const rows = [];
  ws.eachRow((row, idx) => {
    if (idx === 1) return; // skip header
    rows.push(row.values.slice(1));
  });
  if (!rows.length) throw new Error("Data kosong!");

  const [
    nama,
    usaha,
    hp,
    desa,
    kota,
    estate,
    cdo,
    klasifikasi,
    ...monitoringRaw
  ] = rows[0];
  const meta = { nama, usaha, hp, desa, kota, estate, cdo, klasifikasi };

  const monitoringTemplate = [
    "Jumlah produksi per bulan",
    "Jumlah tenaga kerja tetap",
    "Jumlah tenaga kerja tidak tetap",
    "Omset / penjualan per bulan",
    "Biaya operasional per bulan",
    "Masalah yang dihadapi",
    "Hasil tindak lanjut dari monitoring sebelumnya",
  ];
  const monitoring = monitoringTemplate.map((uraian, i) => ({
    uraian,
    item: "",
    hasil: monitoringRaw[i] ?? "",
  }));

  return { meta, monitoring };
}
