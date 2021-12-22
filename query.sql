CREATE TABLE t_user(
   iuser INT UNSIGNED AUTO_INCREMENT,
   uid VARCHAR(20) UNIQUE NOT NULL,
   upw VARCHAR(150) NOT NULL,
   nm VARCHAR(5) NOT NULL,
   gender tinyINT unsigned CHECK(gender IN (1, 2)),
   rdt DATETIME DEFAULT NOW(),
   PRIMARY KEY(iuser)
);

CREATE TABLE t_board(
    iboard INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    ctnt VARCHAR(3000) NOT NULL,
    writer INT UNSIGNED NOT NULL,
    hit INT UNSIGNED not null DEFAULT 0,
    rdt DATETIME NOT NULL DEFAULT NOW(),
    mdt DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY(writer) REFERENCES t_user(iuser)
);

CREATE TABLE t_board_cmt(
    icmt INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    iboard INT UNSIGNED NOT NULL,
    FOREIGN KEY (iboard) REFERENCES t_board(iboard),
    ctnt VARCHAR(2000) NOT NULL,
    writer INT UNSIGNED NOT NULL,
    FOREIGN KEY (writer) REFERENCES t_user(iuser),
    rdt DATETIME DEFAULT NOW()
);
-- 프로필 이미지
ALTER TABLE t_user ADD profileImg VARCHAR(50);

CREATE TABLE t_board_heart(
  iuser INT UNSIGNED,
  iboard INT UNSIGNED,
  rdt DATETIME DEFAULT NOW(),
  PRIMARY key(iuser, iboard),
  FOREIGN KEY(iuser) REFERENCES t_user(iuser),
  FOREIGN KEY(iboard) REFERENCES t_board(iboard)
);