import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/logo.PNG";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
  },
  logo: {
    width: 60,
    height: 60,
    position: "absolute",
    top: 20,
    left: 40,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  titleMain: {
    fontSize: 14,
    fontWeight: "bold",
  },
  titleSub: {
    fontSize: 12,
  },
  formTitle: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaLeft: {
    width: "50%",
  },
  metaRight: {
    width: "50%",
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "50%",
    fontWeight: "bold",
  },
  value: {
    width: "50%",
  },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#eee",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
  },
  col1: { width: "40%" },
  col2: { width: "30%" },
  col3: { width: "30%" },
});

const MSEDocument = ({ data }) => {
  const { meta, monitoring, comparison } = data;

  const metaLeft = [
    ["Nama Pelaku/Pemilik/Lembaga UMKM", meta.nama],
    ["Nama Usaha/Merk Produk", meta.usaha],
    ["Nomor HP/WA", meta.hp],
    ["Desa", meta.desa],
  ];
  const metaRight = [
    ["Kota/Kabupaten", meta.kota],
    ["Estate", meta.estate],
    ["Nama CDO", meta.cdo],
    ["Klasifikasi Mitra", meta.klasifikasi],
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.logo} src={logo} />
        <View style={styles.header}>
          <Text style={styles.titleMain}>PT. RIAU ANDALAN PULP AND PAPER</Text>
          <Text style={styles.titleSub}>
            Community Development – SME’s Program
          </Text>
          <Text style={styles.formTitle}>
            Formulir Monitoring Mitra Dampingan SME’s OFFLINE
          </Text>
        </View>

        {}
        <View style={styles.metaContainer}>
          <View style={styles.metaLeft}>
            {metaLeft.map(([label, val]) => (
              <View key={label} style={styles.metaRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{val || "-"}</Text>
              </View>
            ))}
          </View>
          <View style={styles.metaRight}>
            {metaRight.map(([label, val]) => (
              <View key={label} style={styles.metaRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{val || "-"}</Text>
              </View>
            ))}
          </View>
        </View>

        {}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.col1]}>Uraian</Text>
            <Text style={[styles.tableColHeader, styles.col2]}>Item</Text>
            <Text style={[styles.tableColHeader, styles.col3]}>
              Hasil Monitoring
            </Text>
            {comparison && (
              <Text style={[styles.tableColHeader, styles.col3]}>
                Pembanding
              </Text>
            )}
          </View>

          {monitoring.map((row, i) => {
            if (row.uraian === "Omset / penjualan per bulan") {
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.col1]}>
                    {row.uraian}
                  </Text>
                  <Text style={[styles.tableCol, styles.col2]}>Rp</Text>
                  <Text style={[styles.tableCol, styles.col3]}>
                    {row.items[0]?.hasil || "-"}
                  </Text>
                  {comparison && (
                    <Text style={[styles.tableCol, styles.col3]}>
                      {comparison[i]?.items[0]?.hasil || "-"}
                    </Text>
                  )}
                </View>
              );
            }

            return row.items.map((item, j) => (
              <View key={`${i}-${j}`} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.col1]}>{row.uraian}</Text>
                <Text style={[styles.tableCol, styles.col2]}>
                  {item.nama || "-"}
                </Text>
                <Text style={[styles.tableCol, styles.col3]}>
                  {item.hasil || "-"}
                </Text>
                {comparison && (
                  <Text style={[styles.tableCol, styles.col3]}>
                    {comparison[i]?.items[j]?.hasil || "-"}
                  </Text>
                )}
              </View>
            ));
          })}
        </View>
      </Page>
    </Document>
  );
};

export default MSEDocument;
