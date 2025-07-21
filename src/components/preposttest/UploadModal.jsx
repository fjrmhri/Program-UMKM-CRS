import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { parseExcel, computeStats } from "../../utils/excelUtils";
import Spinner from "./Spinner";

export default function UploadModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [preDate, setPreDate] = useState("");
  const [postDate, setPostDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !preDate || !postDate || !file)
      return alert("Semua isian wajib!");

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext))
      return alert("File harus .xlsx atau .csv");

    setLoading(true);
    try {
      const raw = await parseExcel(file);
      const analyses = computeStats(raw);
      const uid = uuidv4();

      const dataObj = {
        title,
        preDate: new Date(preDate).getTime(),
        postDate: new Date(postDate).getTime(),
        raw,
        analyses,
        createdAt: Date.now(),
      };

      await set(ref(db, `datasets/${uid}`), dataObj);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert(`Gagal upload: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto space-y-6"
      >
        <h2 className="text-xl font-bold mb-2">Tambah Data Pre-Post Test</h2>

        <div>
          <label className="block mb-1 font-medium">Nama Data</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Tanggal Pre Test</label>
            <input
              type="date"
              value={preDate}
              onChange={(e) => setPreDate(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Tanggal Post Test</label>
            <input
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload File Excel</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blur-700 w-full md:w-auto"
          >
            {loading ? <Spinner /> : "Submit"}
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
  );
}
