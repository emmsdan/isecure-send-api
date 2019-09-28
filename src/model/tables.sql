DROP TABLE IF EXISTS `iss_file_url`;
DROP TABLE IF EXISTS `iss_files`;

CREATE TABLE IF NOT EXISTS `iss_files` (
  `id` BINARY(38) PRIMARY KEY,
  `sender_name` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `receiver_email` varchar(255) NOT NULL,
  `expires_in` ENUM("5m", "1h", "12h", "1d", "3d", "5d", "7d") NOT NULL,
  `downloads_allowed` ENUM("1", "10", "15", "20", "25", "50", "100") NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE  `iss_file_url` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `file_id` BINARY(38) NOT NULL,
  `downloads` int(11) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT joint_box
  FOREIGN KEY (file_id)
      REFERENCES iss_files(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

