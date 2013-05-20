
<?php
	header('Content-type: text/json');
	$activeid = $_GET["activeid"];
	if(!$activeid){
		echo json_encode($json = array("code" =>"S_ERROR","error_code" => "activeid not existed"));
	}else{

		// $con=mysql_connect("mysql12.000webhost.com","a5890661_isun","qa1234") or die (mysql_error());
		$con=mysql_connect("localhost","root","admin") or die (mysql_error());
		if(!$con) echo "Failed!";
		// mysql_select_db("a5890661_ispent", $con);
		mysql_select_db("ispent", $con);
		// 查询参与人员；
		$candicates = array();
		$user_result = mysql_query("SELECT * FROM user where activeid = ".$activeid." order by seq");
		while($userRow = mysql_fetch_array($user_result)){
			// print_r($userRow);
			array_push($candicates,$userRow["name"]);
		}
		//
		// 保存所有的明细
		$details = array();
		$flow_result = mysql_query("SELECT * FROM flow where activeid = ".$activeid);
		while($flowRow = mysql_fetch_array($flow_result)){
			$flowid = $flowRow["id"];
			$flowitem = array(
				"outs" => array(),
				"users" => array(),
				"id" => $flowid,
				"location" => $flowRow["location"],
				"date" => $flowRow["date"],
				"desc" => $flowRow["forwhat"]
				);
			// 生成outs的数组
			$outs_result = mysql_query("SELECT * FROM outs where flowid = ".$flowid." order by userid");
			while($outsRow = mysql_fetch_array($outs_result)){
				array_push($flowitem["outs"],(int)$outsRow["total"]);
			}
			// 生成users的数组
			$spent_result = mysql_query("SELECT * FROM spent where flowid = ".$flowid." order by userid");
			while($spentRow = mysql_fetch_array($spent_result)){
				array_push($flowitem["users"],(int)$spentRow["partial"]);
			}
			// push
			array_push($details,$flowitem);
		}
		
		// $result = mysql_query("SELECT * FROM user");
		
		// while($row = mysql_fetch_array($result))
		//   {
		//   $alipayArray[$row['id']] = $row['alipay'];
		//   }
		mysql_close($con);
		$result = array('candicates' =>$candicates,"details" => $details);
		echo json_encode($json = array("code" =>"S_OK","data" => $result));
	}
?>
