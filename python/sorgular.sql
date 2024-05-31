-- Haftanın en çok satan 10 ürünü
SELECT StokKodu, SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-01 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled'
GROUP BY StokKodu
ORDER BY TOTAL DESC
LIMIT 10;

-- Günün en çok satan ürünü
SELECT StokKodu, SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-07 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled'
GROUP BY StokKodu
ORDER BY TOTAL DESC
LIMIT 1;

-- Haftalık toplam sipariş sayısı
SELECT COUNT(ConnectSiparis.Id) as TOTAL
FROM ConnectSiparis
INNER JOIN ConnectSiparisEk ON ConnectSiparisEk.SiparisId = ConnectSiparis.Id
WHERE ConnectSiparis.SiparisTarihi > '2024-05-01 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisEk.PlatformDurum != 'Cancelled';

-- Günlük toplam sipariş sayısı
SELECT COUNT(ConnectSiparis.Id) as TOTAL
FROM ConnectSiparis
INNER JOIN ConnectSiparisEk ON ConnectSiparisEk.SiparisId = ConnectSiparis.Id
WHERE ConnectSiparis.SiparisTarihi > '2024-05-07 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisEk.PlatformDurum != 'Cancelled';


-- Haftalık toplam satılan ürün sayısı
SELECT SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-01 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled';

-- Günlük toplam satılan ürün sayısı
SELECT SUM(ConnectSiparisKalemleri.Miktar) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-07 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled';

-- Haftalık toplam ciro
SELECT SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-01 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled';

-- Günlük toplam ciro
SELECT SUM(ConnectSiparisKalemleri.Miktar * ConnectSiparisKalemleri.Fiyat) as TOTAL
FROM ConnectSiparisEk
INNER JOIN ConnectSiparisKalemleri ON ConnectSiparisKalemleri.SiparisId = ConnectSiparisEk.SiparisId
INNER JOIN ConnectSiparis ON ConnectSiparis.Id = ConnectSiparisKalemleri.SiparisId 
WHERE ConnectSiparis.SiparisTarihi > '2024-05-07 00:00:00.000'
AND ConnectSiparis.SiparisTarihi < '2024-05-07 23:59:59.999'
AND ConnectSiparisKalemleri.PlatformStatus != 'Cancelled';

