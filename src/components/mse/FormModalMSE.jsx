import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const monitoringTemplate = [
  {
    uraian: "Jumlah produksi per bulan",
    items: [{ nama: "", hasil: "" }],
    allowAdd: true,
    defaultItems: [],
    showItem: true,
  },
  {
    uraian: "Jumlah tenaga kerja tetap",
    items: [
      { nama: "Laki-laki", hasil: "" },
      { nama: "Perempuan", hasil: "" },
    ],
    allowAdd: false,
    defaultItems: ["Laki-laki", "Perempuan"],
    showItem: true,
  },
  {
    uraian: "Jumlah tenaga kerja tidak tetap",
    items: [
      { nama: "Laki-laki", hasil: "" },
      { nama: "Perempuan", hasil: "" },
    ],
    allowAdd: false,
    defaultItems: ["Laki-laki", "Perempuan"],
    showItem: true,
  },
  {
    uraian: "Omset / penjualan per bulan",
    items: [{ nama: null, hasil: "" }],
    allowAdd: false,
    defaultItems: [],
    showItem: false,
  },
  {
    uraian: "Biaya operasional per bulan",
    items: [
      { nama: "Bahan baku", hasil: "" },
      { nama: "Tenaga kerja", hasil: "" },
      { nama: "Listrik", hasil: "" },
      { nama: "Lainnya(sebutkan)", hasil: "" },
      { nama: "Total", hasil: "" },
    ],
    allowAdd: true,
    defaultItems: ["Bahan baku", "Tenaga kerja", "Listrik", "Lainnya"],
    showItem: true,
  },
  {
    uraian: "Masalah yang dihadapi",
    items: [
      { nama: "Permasalahan", hasil: "" },
      { nama: "Rencana tindak lanjut", hasil: "" },
    ],
    allowAdd: true,
    defaultItems: ["Permasalahan", "Rencana tindak lanjut"],
    showItem: true,
  },
  {
    uraian: "Hasil tindak lanjut dari monitoring sebelumnya",
    items: [
      {
        nama: "Hasil rencana tindak lanjut dari permasalahan di monitoring sebelumnya",
        hasil: "",
      },
    ],
    allowAdd: true,
    defaultItems: [
      "Hasil rencana tindak lanjut dari permasalahan di monitoring sebelumnya",
    ],
    showItem: true,
  },
];

export default function FormModalMSE({ onClose }) {
  const [meta, setMeta] = useState({
    nama: "",
    usaha: "",
    hp: "",
    desa: "",
    kota: "",
    estate: "",
    cdo: "",
    klasifikasi: "",
  });
  const [monitoring, setMonitoring] = useState(monitoringTemplate);

  const handleMetaChange = (e) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const formatNumber = (value) => {
    if (!value) return "";

    // Pisahkan angka di awal dari sisanya
    const match = value.match(/^([\d,.]+)(.*)$/); // Ambil angka + sisa teks

    if (!match) return value; // Jika tidak cocok, kembalikan apa adanya

    const rawNumber = match[1].replace(/[^0-9]/g, "");
    const suffix = match[2] || "";

    const formattedNumber = rawNumber
      ? Number(rawNumber).toLocaleString("id-ID")
      : "";

    return formattedNumber + suffix;
  };

  const handleItemChange = (monIdx, itemIdx, field, value) => {
    const updated = [...monitoring];

    if (field === "hasil") {
      updated[monIdx].items[itemIdx][field] = formatNumber(value);
    } else {
      updated[monIdx].items[itemIdx][field] = value;
    }

    setMonitoring(updated);
  };

  const handleAddItem = (monIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.push({ nama: "", hasil: "" });
    setMonitoring(updated);
  };

  const handleRemoveItem = (monIdx, itemIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.splice(itemIdx, 1);
    setMonitoring(updated);
  };

  const validate = () => {
    for (const key in meta) {
      if (!meta[key]) return false;
    }
    for (const mon of monitoring) {
      for (const item of mon.items) {
        if (
          mon.uraian !== "Hasil tindak lanjut dari monitoring sebelumnya" &&
          !item.nama &&
          mon.defaultItems.length === 0
        )
          return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = uuidv4();

    const monitoringData = monitoring.map((mon) => ({
      uraian: mon.uraian,
      items: mon.items.map((item) => ({
        nama: item.nama && item.nama.trim() !== "" ? item.nama : "-",
        hasil: item.hasil && item.hasil.trim() !== "" ? item.hasil : "-",
      })),
    }));

    const metaData = Object.fromEntries(
      Object.entries(meta).map(([k, v]) => [k, v.trim() !== "" ? v : "-"])
    );

    await set(ref(db, `mse/${id}`), {
      id,
      meta: metaData,
      monitoring: monitoringData,
      createdAt: Date.now(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold mb-2">Input Data Monitoring MSE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="nama"
              value={meta.nama}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Nama pelaku/pemilik/lembaga UMKM"
              required
            />
            <input
              name="usaha"
              value={meta.usaha}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Nama usaha / merk produk"
              required
            />
            <input
              name="hp"
              value={meta.hp}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Nomor HP / WA mitra"
              required
            />
            <input
              name="desa"
              value={meta.desa}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Desa"
              required
            />
            <input
              name="kota"
              value={meta.kota}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Kota / Kabupaten"
              required
            />
            <input
              name="estate"
              value={meta.estate}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Estate"
              required
            />
            <input
              name="cdo"
              value={meta.cdo}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Nama CDO"
              required
            />
            <select
              name="klasifikasi"
              value={meta.klasifikasi}
              onChange={handleMetaChange}
              className="border px-3 py-2 rounded w-full"
              required
            >
              <option value="">Klasifikasi Mitra</option>
              <option value="Pemula">Pemula</option>
              <option value="Berkembang">Berkembang</option>
              <option value="Maju">Maju</option>
            </select>
          </div>
          <div className="mt-4 space-y-6">
            {monitoring.map((mon, monIdx) => (
              <div key={monIdx} className="bg-gray-50 p-4 rounded shadow">
                <h3 className="font-semibold mb-3">{mon.uraian}</h3>
                <div className="space-y-3">
                  {mon.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`grid gap-3 items-center ${
                        mon.showItem
                          ? "grid-cols-1 md:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {mon.showItem && (
                        <input
                          type="text"
                          value={item.nama ?? ""}
                          onChange={(e) =>
                            handleItemChange(
                              monIdx,
                              itemIdx,
                              "nama",
                              e.target.value
                            )
                          }
                          className="border px-3 py-2 rounded w-full"
                          placeholder={
                            mon.defaultItems.length > 0
                              ? mon.defaultItems[itemIdx] || "Item"
                              : "Item"
                          }
                          required={
                            mon.defaultItems.length === 0 && mon.showItem
                          }
                          disabled={mon.defaultItems.length > 0}
                        />
                      )}

                      {[
                        "Masalah yang dihadapi",
                        "Hasil tindak lanjut dari monitoring sebelumnya",
                      ].includes(mon.uraian) ? (
                        <textarea
                          value={item.hasil}
                          onChange={(e) =>
                            handleItemChange(
                              monIdx,
                              itemIdx,
                              "hasil",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="border px-3 py-2 rounded w-full resize-y  text-justify"
                          placeholder="Hasil Monitoring"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.hasil}
                          onChange={(e) =>
                            handleItemChange(
                              monIdx,
                              itemIdx,
                              "hasil",
                              e.target.value
                            )
                          }
                          className="border px-3 py-2 rounded w-full text-left"
                          placeholder="Hasil Monitoring"
                        />
                      )}
                      {mon.allowAdd && mon.showItem && (
                        <button
                          type="button"
                          className="bg-green-100 text-green-700 px-3 py-2 rounded text-xs w-full md:w-auto"
                          onClick={() => handleRemoveItem(monIdx, itemIdx)}
                          disabled={mon.items.length === 1}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}
                  {mon.allowAdd && mon.showItem && (
                    <button
                      type="button"
                      className=" px-3 py-2 rounded text-xs mt-2 w-full md:w-auto"
                      onClick={() => handleAddItem(monIdx)}
                    >
                      + Tambah Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full md:w-auto"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline w-full md:w-auto"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
