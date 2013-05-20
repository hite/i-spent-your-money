
<?php
	header('Content-type: text/json');
	// $con=mysql_connect("mysql12.000webhost.com","a5890661_isun","qa1234") or die (mysql_error());
	$con=mysql_connect("localhost","root","admin") or die (mysql_error());
	if(!$con) echo "Failed!";
	// mysql_select_db("a5890661_ispent", $con);
	mysql_select_db("ispent", $con);

	//mysql_query("INSERT INTO user (id,name, alipay)VALUES (3,'Griffin', '35@173.com')");

	//mysql_query("INSERT INTO user (id,name, alipay)VALUES (4,'Glenn',  '33@187.com')");
	// 新建一个新的activeid。
	$currentTime = time();
	$activeid = $currentTime;
	mysql_query("INSERT INTO balance (activeid)VALUES ($currentTime)");
	// 新建此次活动的参与者，
	$codeSource2 = stripslashes($_POST["codesource"]);
	$parsed = json_decode($codeSource2,true);
	$candicates = $parsed["candicates"];
	foreach($candicates as $key=>$candit) {
		mysql_query("INSERT INTO user(activeid,name,seq)VALUES ($activeid,'$candit',$key)");
		//
	}
	//
	// 保留顺序和pid的对应关系，在后面保存spent表的时候用；
	$user_result = mysql_query("SELECT * FROM user where activeid = ".$activeid);
	while($userRow = mysql_fetch_array($user_result)){
		// print_r($userRow);
		$userMaps[$userRow["seq"]] = $userRow["id"];
	 }
	// print_r($userMaps);
	// 保存所有的明细
	$details = $parsed["details"];
	$flowid = time();
	foreach($details as $key=>$detail) {
		// 预先保存了付钱的人的明细，计算出总支出，供flow表使用
		$outs = $detail["outs"];
		$flow_total = 0;
		$flowid++;
		foreach($outs as $key=>$out) {
			$out_userid = $userMaps[$key];
			$flow_total = $flow_total+$out;
			mysql_query("INSERT INTO outs(flowid,userid,total)VALUES ($flowid,$out_userid,$out)");	
		}
		// 先保存这次的明细
		$location = $detail["location"];
		$forwhat = addslashes($detail["desc"]);
			//sucks
		if($detail["date"]==""){
			mysql_query("INSERT INTO flow(id,activeid,location,date,forwhat,total)VALUES($flowid,$activeid,'$location',null,'$forwhat',$flow_total)");	
		}else{
			$date = $detail["date"];
			mysql_query("INSERT INTO flow(id,activeid,location,date,forwhat,total)VALUES($flowid,$activeid,'$location','$date','$forwhat',$flow_total)");	
		}
		// 再保存参与者
		$users = $detail["users"];

		// print_r($users);
		foreach($users as $key=>$spent_user) {
			$spent_userid = $userMaps[$key];
			// 历史数据里有true和false转化为0,1
			if($spent_user==1){
				$spent_partial = 1;
			}else{
				$spent_partial = 0;
			}
			mysql_query("INSERT INTO spent(flowid,userid,partial)VALUES ($flowid,$spent_userid,$spent_partial)");	
		}
	}
	
	// $result = mysql_query("SELECT * FROM user");
	
	// while($row = mysql_fetch_array($result))
	//   {
	//   $alipayArray[$row['id']] = $row['alipay'];
	//   }
	mysql_close($con);

	echo json_encode($json = array('activeid' =>$activeid));
?>
