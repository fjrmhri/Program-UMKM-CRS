import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../preposttest/Spinner";
import { parseExcelMSE } from "../../utils/excelUtils";

export default function UploadModalMSE({ onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("File wajib diisi!");
    setLoading(true);
    try {
      const { meta, monitoring } = await parseExcelMSE(file);
      const id = uuidv4();
      await set(ref(db, `mse/${id}`), {
        id,
        meta,
        monitoring,
        createdAt: Date.now(),
      });
      onClose();
    } catch (err) {
      alert("Gagal upload: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-lg w-full max-w-xs sm:max-w-lg space-y-4"
      >
        <h2 className="text-lg font-bold">Upload Data MSE dari Excel</h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            {loading ? <Spinner /> : "Upload"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:underline w-full"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
