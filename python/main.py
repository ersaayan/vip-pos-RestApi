import time
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import pyodbc

cors = CORS()
app = Flask(__name__)
cors.init_app(
    app,
    resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST"],
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers",
                "application/json",
                "text/plain",
                "*/*",
            ],
        }
    },
)


# SQL Server bağlantı bilgileri
server = "95.173.181.140"
database = "MYOR"
username = "sa"
password = "1234"
driver = "{ODBC Driver 17 for SQL Server}"

# SQL Server'a bağlan
conn = pyodbc.connect(
    "DRIVER="
    + driver
    + ";SERVER="
    + server
    + ";DATABASE="
    + database
    + ";UID="
    + username
    + ";PWD="
    + password
)


# Endpoint 1: Haftanın en çok satan 10 ürünü
@cross_origin()
@app.route("/haftanin_en_cok_satan_urunleri", methods=["GET"])
def haftanin_en_cok_satan_urunleri():
    time.sleep(9)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT TOP 10 StokKodu, SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) - 6, 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered'
        GROUP BY StokKodu
        ORDER BY TOTAL DESC;
    """
    )
    rows = cursor.fetchall()
    result = [{"StokKodu": row.StokKodu, "TOTAL": row.TOTAL} for row in rows]
    return jsonify(result)


# Endpoint 2: Günün en çok satan ürünü
@app.route("/gunun_en_cok_satan_urunu", methods=["GET"])
@cross_origin()
def gunun_en_cok_satan_urunu():
    time.sleep(10)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT TOP 1 StokKodu, SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered'
        GROUP BY StokKodu
        ORDER BY TOTAL DESC;
    """
    )
    row = cursor.fetchone()
    result = {"StokKodu": row.StokKodu, "TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 3: Haftalık toplam sipariş sayısı
@app.route("/haftalik_toplam_siparis_sayisi", methods=["GET"])
@cross_origin()
def haftalik_toplam_siparis_sayisi():
    time.sleep(12)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT COUNT(ConnectSiparis.Id) as TOTAL
        FROM ConnectSiparis
        INNER JOIN ConnectSiparisEk ON ConnectSiparisEk.SiparisId = ConnectSiparis.Id
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) - 6, 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisEk.PlatformDurum != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 4: Günlük toplam sipariş sayısı
@app.route("/gunluk_toplam_siparis_sayisi", methods=["GET"])
def gunluk_toplam_siparis_sayisi():
    time.sleep(13)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT COUNT(ConnectSiparis.Id) as TOTAL
        FROM ConnectSiparis
        INNER JOIN ConnectSiparisEk ON ConnectSiparisEk.SiparisId = ConnectSiparis.Id
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisEk.PlatformDurum != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 5: Günlük toplam kargolanan sipariş sayısı
@app.route("/toplam_kargolanmayı_bekleyen_siparis_sayisi", methods=["GET"])
@cross_origin()
def gunluk_toplam_kargolanan_siparis_sayisi():
    time.sleep(14)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT COUNT(ConnectSiparis.Id) as TOTAL
        FROM ConnectSiparis
        INNER JOIN ConnectSiparisEk ON ConnectSiparisEk.SiparisId = ConnectSiparis.Id
        WHERE ConnectSiparisEk.PlatformDurum = 'Created' OR ConnectSiparisEk.PlatformDurum = 'ReadyToShip' OR ConnectSiparisEk.PlatformDurum = 'Picking';
        """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 6: Haftalık toplam satılan ürün sayısı
@app.route("/haftalik_toplam_satis_sayisi", methods=["GET"])
@cross_origin()
def haftalik_toplam_satis_sayisi():
    time.sleep(15)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) - 6, 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 7: Günlük toplam satılan ürün sayısı
@app.route("/gunluk_toplam_satis_sayisi", methods=["GET"])
@cross_origin()
def gunluk_toplam_satis_sayisi():
    time.sleep(16)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 8: Haftalık toplam ciro
@app.route("/haftalik_toplam_ciro", methods=["GET"])
@cross_origin()
def haftalik_toplam_ciro():
    time.sleep(18)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) - 6, 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 9: Günlük toplam ciro
@app.route("/gunluk_toplam_ciro", methods=["GET"])
@cross_origin()
def gunluk_toplam_ciro():
    time.sleep(20)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) as TOTAL
        FROM ConnectSiparisEk
        INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
        INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
        WHERE ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
        AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
        AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' AND PlatformDurum != 'Returned' AND PlatformDurum != 'UnDelivered';
    """
    )
    row = cursor.fetchone()
    result = {"TOTAL": row.TOTAL}
    return jsonify(result)


# Endpoint 10: DÜn yapılan satışlar
@app.route("/dün-yapılan-satışlar-grafiği", methods=["GET"])
@cross_origin()
def dün_yapılan_satıslar():
    time.sleep(5)
    cursor = conn.cursor()
    cursor.execute(
        """
SELECT 
    CASE 
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 0 AND 3 THEN '00.00-04.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 4 AND 7 THEN '04.00-08.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 8 AND 11 THEN '08.00-12.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 12 AND 15 THEN '12.00-16.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 16 AND 19 THEN '16.00-20.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 20 AND 23 THEN '20.00-00.00'
    END AS SaatAraligi,
    SUM(ConnectSiparisKalemleri.Miktar) AS ToplamMiktar,
    SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) AS ToplamCiro
FROM 
    ConnectSiparisEk
INNER JOIN 
    ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN 
    ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE 
    ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-1, 0)
    AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
    AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' 
    AND ConnectSiparisKalemleri.PlatformStatus != 'Returned' 
    AND ConnectSiparisKalemleri.PlatformStatus != 'UnDelivered'
GROUP BY 
    CASE 
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 0 AND 3 THEN '00.00-04.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 4 AND 7 THEN '04.00-08.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 8 AND 11 THEN '08.00-12.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 12 AND 15 THEN '12.00-16.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 16 AND 19 THEN '16.00-20.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 20 AND 23 THEN '20.00-00.00'
    END
ORDER BY 
    SaatAraligi;
    """
    )
    rows = cursor.fetchall()
    result = [
        {
            "Saat_Aralığı": row.SaatAraligi,
            "Toplam_Miktar": row.ToplamMiktar,
            "Toplam_Ciro": row.ToplamCiro,
        }
        for row in rows
    ]
    return jsonify(result)


# Endpoint 10: bugÜn yapılan satışlar
@app.route("/bugün-yapılan-satışlar-grafiği", methods=["GET"])
@cross_origin()
def bugün_yapılan_satıslar():
    cursor = conn.cursor()
    cursor.execute(
        """
SELECT 
    CASE 
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 0 AND 3 THEN '00.00-04.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 4 AND 7 THEN '04.00-08.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 8 AND 11 THEN '08.00-12.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 12 AND 15 THEN '12.00-16.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 16 AND 19 THEN '16.00-20.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 20 AND 23 THEN '20.00-00.00'
    END AS SaatAraligi,
    SUM(ConnectSiparisKalemleri.Miktar) AS ToplamMiktar,
    SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) AS ToplamCiro
FROM 
    ConnectSiparisEk
INNER JOIN 
    ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN 
    ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE 
    ConnectSiparis.SiparisTarihi >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)
    AND ConnectSiparis.SiparisTarihi < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)
    AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled' 
    AND ConnectSiparisKalemleri.PlatformStatus != 'Returned' 
    AND ConnectSiparisKalemleri.PlatformStatus != 'UnDelivered'
GROUP BY 
    CASE 
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 0 AND 3 THEN '00.00-04.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 4 AND 7 THEN '04.00-08.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 8 AND 11 THEN '08.00-12.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 12 AND 15 THEN '12.00-16.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 16 AND 19 THEN '16.00-20.00'
        WHEN DATEPART(HOUR, ConnectSiparis.SiparisTarihi) BETWEEN 20 AND 23 THEN '20.00-00.00'
    END
ORDER BY 
    SaatAraligi;
    """
    )
    rows = cursor.fetchall()
    result = [
        {
            "Saat_Aralığı": row.SaatAraligi,
            "Toplam_Miktar": row.ToplamMiktar,
            "Toplam_Ciro": row.ToplamCiro,
        }
        for row in rows
    ]
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
