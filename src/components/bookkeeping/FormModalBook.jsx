import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";

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
    ],
    allowAdd: true,
    defaultItems: ["Bahan baku", "Tenaga kerja", "Listrik", "Lainnya"],
    showItem: true,
  },
  {
    uraian: "Total biaya operasional per bulan",
    items: [{ nama: null, hasil: "" }],
    allowAdd: false,
    defaultItems: [],
    showItem: false,
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
        nama: "Hasil rencana tindak lanjut masalah",
        hasil: "",
      },
    ],
    allowAdd: true,
    defaultItems: ["Hasil rencana tindak lanjut masalah "],
    showItem: true,
  },
];

export default function FormModalMSE({ onClose, existingData }) {
  const { userData, user } = useAuth();
  const [meta, setMeta] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    klasifikasi: "",
    labaBersih: 0,
  });
  const [monitoring, setMonitoring] = useState(monitoringTemplate);
  const isEditMode = !!existingData;

  const cleanNumberString = (str) => {
    if (typeof str !== "string") return str;
    return str.replace(/[^0-9,-]+/g, "").replace(",", ".");
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = parseFloat(cleanNumberString(String(value)));
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  useEffect(() => {
    if (isEditMode) {
      setMeta(existingData.meta || {});

      const mergedMonitoring = monitoringTemplate.map((templateMon) => {
        const existingMon = (existingData.monitoring || []).find(
          (mon) => mon.uraian === templateMon.uraian
        );

        const itemsToUse = (existingMon?.items || templateMon.items).map(
          (item) => ({
            ...item,
            hasil: formatNumber(item.hasil),
          })
        );

        return {
          ...templateMon,
          items: itemsToUse,
        };
      });
      setMonitoring(mergedMonitoring);
    } else {
      if (userData) {
        setMeta((prevMeta) => ({
          ...prevMeta,
          nama: userData.nama || "",
          usaha: userData.usaha || "",
          hp: userData.hp || "",
          desa: userData.desa || "",
          kota: userData.kota || "",
          estate: userData.estate || "",
          cdo: userData.cdo || "",
        }));
      }

      setMonitoring(
        monitoringTemplate.map((mon) => ({
          ...mon,
          items: mon.items.map((item) => ({ ...item, hasil: "" })),
        }))
      );
    }
  }, [existingData, userData, isEditMode]);

  const calculateFinancials = (currentMonitoring) => {
    let totalProduksi = 0;
    let totalBiayaOperasional = 0;

    const produksiMon = currentMonitoring.find(
      (mon) => mon.uraian === "Jumlah produksi per bulan"
    );
    if (produksiMon) {
      totalProduksi = produksiMon.items.reduce((sum, item) => {
        return sum + (parseFloat(cleanNumberString(item.hasil)) || 0);
      }, 0);
    }

    const biayaMon = currentMonitoring.find(
      (mon) => mon.uraian === "Biaya operasional per bulan"
    );
    if (biayaMon) {
      totalBiayaOperasional = biayaMon.items.reduce((sum, item) => {
        if (item.nama === "Total") return sum;
        return sum + (parseFloat(cleanNumberString(item.hasil)) || 0);
      }, 0);
    }

    const updatedMonitoring = [...currentMonitoring];
    const omsetMonIndex = updatedMonitoring.findIndex(
      (mon) => mon.uraian === "Omset / penjualan per bulan"
    );
    if (omsetMonIndex !== -1) {
      updatedMonitoring[omsetMonIndex].items[0].hasil =
        formatNumber(totalProduksi);
    }

    const totalBiayaOperasionalMonIndex = updatedMonitoring.findIndex(
      (mon) => mon.uraian === "Total biaya operasional per bulan"
    );
    if (totalBiayaOperasionalMonIndex !== -1) {
      updatedMonitoring[totalBiayaOperasionalMonIndex].items[0].hasil =
        formatNumber(totalBiayaOperasional);
    }

    const labaBersih = totalProduksi - totalBiayaOperasional;

    const UMK_KUANSING = 3692796;
    const BATAS_MANDIRI = 15000000;
    let klasifikasi = "";

    if (labaBersih < UMK_KUANSING) {
      klasifikasi = "Tumbuh";
    } else if (labaBersih >= UMK_KUANSING && labaBersih < BATAS_MANDIRI) {
      klasifikasi = "Berkembang";
    } else if (labaBersih >= BATAS_MANDIRI) {
      klasifikasi = "Mandiri";
    }

    setMonitoring(updatedMonitoring);
    setMeta((prevMeta) => ({
      ...prevMeta,
      klasifikasi: klasifikasi,
      labaBersih: labaBersih,
    }));
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

  useEffect(() => {
    calculateFinancials(monitoring);
  }, [monitoring]);

  const handleAddItem = (monIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.push({ nama: "", hasil: "" });
    setMonitoring(updated);
  };

  const handleRemoveItem = (monIdx, itemIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.splice(itemIdx, 1);
    setMonitoring(updated);
    calculateFinancials(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = isEditMode ? existingData.id : uuidv4();

    const monitoringDataToSave = monitoring.map((mon) => ({
      uraian: mon.uraian,
      items: mon.items.map((item) => ({
        nama: item.nama?.trim() || "-",
        hasil: cleanNumberString(item.hasil) || "-",
      })),
    }));

    const payload = {
      id,
      meta: {
        ...meta,

        nama: userData?.nama || "",
        usaha: userData?.usaha || "",
        hp: userData?.hp || "",
        desa: userData?.desa || "",
        kota: userData?.kota || "",
        estate: userData?.estate || "",
        cdo: userData?.cdo || "",
      },
      monitoring: monitoringDataToSave,
      ...(isEditMode ? {} : { createdAt: Date.now() }),
    };

    const targetRef = ref(db, `bookkeeping/${user.uid}/${id}`);
    await (isEditMode ? update(targetRef, payload) : set(targetRef, payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Monitoring MSE" : "Input Monitoring MSE"}
          </h2>

          {/* Meta Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tanggal Monitoring
              </label>
              <input
                type="date"
                name="tanggal"
                value={meta.tanggal || ""}
                onChange={(e) => setMeta({ ...meta, tanggal: e.target.value })}
                className="h-10 px-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>

          {/* Monitoring Items */}
          <div className="space-y-6">
            {monitoring.map((mon, monIdx) => (
              <div
                key={monIdx}
                className="bg-gray-50 border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  {mon.uraian}
                </h3>
                <div className="space-y-4">
                  {mon.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`grid gap-4 items-center ${
                        mon.showItem ? "grid-cols-1 md:grid-cols-3" : ""
                      }`}
                    >
                      {mon.showItem && (
                        <input
                          type="text"
                          value={item.nama || ""}
                          onChange={(e) =>
                            handleItemChange(
                              monIdx,
                              itemIdx,
                              "nama",
                              e.target.value
                            )
                          }
                          className="h-10 px-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Nama Item"
                          required={
                            mon.defaultItems.length === 0 && mon.showItem
                          }
                          disabled={mon.defaultItems.length > 0}
                        />
                      )}

                      {mon.uraian === "Omset / penjualan per bulan" ||
                      mon.uraian === "Total biaya operasional per bulan" ? (
                        <input
                          type="text"
                          value={item.hasil || ""}
                          className="h-10 px-3 border rounded-lg w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                          readOnly
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.hasil || ""}
                          onChange={(e) =>
                            handleItemChange(
                              monIdx,
                              itemIdx,
                              "hasil",
                              e.target.value
                            )
                          }
                          className="h-10 px-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Nilai hasil"
                        />
                      )}

                      {mon.allowAdd && mon.showItem && (
                        <button
                          type="button"
                          className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
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
                      className="h-10 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition mt-2"
                      onClick={() => handleAddItem(monIdx)}
                    >
                      + Tambah Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
            >
              {isEditMode ? "Perbarui Data" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
