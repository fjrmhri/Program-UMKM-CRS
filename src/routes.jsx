import { Routes, Route } from "react-router-dom";

import Beranda from "./beranda";
import BeritaSorotan from "./berita-&-sorotan";
import Blog from "./blog";
import EstateKami from "./estate-kami";
import Faq from "./faq";
import Galeri from "./galeri";
import HubungiKami from "./hubungi-kami";
import Keberlanjutan from "./keberlanjutan";
import KesehatanKeselamatan from "./kesehatan-&-keselamatan";
import KeterlibatanKomunitas from "./keterlibatan-komunitas";
import KirimanBlog from "./kiriman-blog";
import PeluangKarir from "./peluang-karir";
import Pengakuan from "./pengakuan";
import PetaInteraktif from "./peta-interaktif";
import Portofolio from "./portofolio";
import Proyek from "./proyek";
import SertifikasiKepatuhan from "./sertifikasi-&-kepatuhan";
import TentangKami from "./tentang-kami";
import UnduhanLaporan from "./unduhan-/-laporan";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/berita-sorotan" element={<BeritaSorotan />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/estate-kami" element={<EstateKami />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/galeri" element={<Galeri />} />
      <Route path="/hubungi-kami" element={<HubungiKami />} />
      <Route path="/keberlanjutan" element={<Keberlanjutan />} />
      <Route path="/kesehatan-keselamatan" element={<KesehatanKeselamatan />} />
      <Route
        path="/keterlibatan-komunitas"
        element={<KeterlibatanKomunitas />}
      />
      <Route path="/kiriman-blog" element={<KirimanBlog />} />
      <Route path="/peluang-karir" element={<PeluangKarir />} />
      <Route path="/pengakuan" element={<Pengakuan />} />
      <Route path="/peta-interaktif" element={<PetaInteraktif />} />
      <Route path="/portofolio" element={<Portofolio />} />
      <Route path="/proyek" element={<Proyek />} />
      <Route path="/sertifikasi-kepatuhan" element={<SertifikasiKepatuhan />} />
      <Route path="/tentang-kami" element={<TentangKami />} />
      <Route path="/unduhan-laporan" element={<UnduhanLaporan />} />
    </Routes>
  );
}
