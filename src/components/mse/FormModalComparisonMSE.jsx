import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";

export default function FormModalComparisonMSE({ data, onClose }) {
  const [monitoring, setMonitoring] = useState(
    data.monitoring.map((mon) => ({
      uraian: mon.uraian,
      items: mon.items.map((item) => ({
        nama: item.nama,
        hasil: "",
      })),
    }))
  );

  const handleItemChange = (monIdx, itemIdx, value) => {
    const updated = [...monitoring];
    updated[monIdx].items[itemIdx].hasil = value;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await update(ref(db, `mse/${data.id}`), { comparison: monitoring });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold mb-2">
            Input Data Perbandingan Monitoring MSE
          </h2>
          <div className="mt-4 space-y-6">
            {monitoring.map((mon, monIdx) => (
              <div key={monIdx} className="bg-gray-50 p-4 rounded shadow">
                <h3 className="font-semibold mb-3">{mon.uraian}</h3>
                <div className="space-y-3">
                  {mon.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                    >
                      <input
                        type="text"
                        value={item.nama ?? ""}
                        onChange={(e) => {
                          const updated = [...monitoring];
                          updated[monIdx].items[itemIdx].nama = e.target.value;
                          setMonitoring(updated);
                        }}
                        className="border px-3 py-2 rounded w-full"
                        placeholder="Item"
                      />
                      <input
                        type="text"
                        value={item.hasil}
                        onChange={(e) =>
                          handleItemChange(monIdx, itemIdx, e.target.value)
                        }
                        className="border px-3 py-2 rounded w-full text-right"
                        placeholder="Hasil Perbandingan"
                      />
                      <button
                        type="button"
                        className="bg-green-100 text-green-700 px-3 py-2 rounded text-xs w-full md:w-auto"
                        onClick={() => handleRemoveItem(monIdx, itemIdx)}
                        disabled={mon.items.length === 1}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-xs mt-2 w-full md:w-auto"
                    onClick={() => handleAddItem(monIdx)}
                  >
                    + Tambah Item
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full md:w-auto"
            >
              Simpan Perbandingan
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
