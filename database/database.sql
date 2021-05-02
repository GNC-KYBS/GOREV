CREATE DATABASE kutuphane;

CREATE TABLE kitap(
    k_isbn VARCHAR(13) PRİMARY KEY NOT NULL,
    k_ad VARCHAR(200) NOT NULL,
    k_yazar VARCHAR(200) NOT NULL,
    k_yayınyılı date NOT NULL,
    k_stok INT NOT NULL,
    UNIQUE(k_isbn)
);

CREATE TABLE uye(
    u_email VARCHAR(50) PRİMARY KEY NOT NULL,
    u_kad VARCHAR(40) NOT NULL,
    u_adSoyad VARCHAR(40) NOT NULL,
    u_password VARCHAR(200) NOT NULL,
    UNIQUE(u_email)
);
--bir kullanıcı birden fazla kitap alabilir durumu için.
CREATE TABLE sepet(
    s_isbn VARCHAR(13) NOT NULL,
    s_kitapadi VARCHAR(50) NOT NULL,
    s_kyazari VARCHAR(50) NOT NULL,
    s_kitapsayi SMALLINT Default(1) NOT NULL
);
--kullanıcı ve aldığı kitabı görüntülemek için.
CREATE TABLE odunc(
    o_email VARCHAR(50) NOT NULL,
    o_kad VARCHAR(50) NOT NULL,
    o_adSoyad VARCHAR(50) NOT NULL,
    o_isbn VARCHAR(13) NOT NULL,
    o_kitapadi VARCHAR(50) NOT NULL,
    o_kyazari VARCHAR(50) NOT NULL,
);

