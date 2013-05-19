-- | balance |
 CREATE TABLE `balance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activeid` int(11) DEFAULT NULL,
  `userids` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1368939694 DEFAULT CHARSET=utf8

-- | user  | 
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `alipay` varchar(20) DEFAULT NULL,
  `activeid` int(11) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8 

 -- | flow  | 
 CREATE TABLE `flow` (
  `id` int(11) NOT NULL,
  `total` int(11) DEFAULT NULL,
  `location` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `activeid` int(11) DEFAULT NULL,
  `forwhat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

 -- | spent | 
 CREATE TABLE `spent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `flowid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `partial` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2011 DEFAULT CHARSET=utf8 

 -- | outs  | 
 CREATE TABLE `outs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `flowid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1851 DEFAULT CHARSET=utf8