             window.balance = {
                candicates:[],
                details:[]
            };
            function syncData(_type,_data){
                // 同步帐单的输出
                if(_type=="d" || _type == "a"){
                    var cominator = _type=="d"?-1:1;
                    var balances = $(".js-balance").children();
                    var total = 0;
                    $.each(balances,function(index,balance){
                        var out = _data.outs[index];
                        if(out>0){
                            // 同时作为支出减去
                            updateBalanceFunc(balance,cominator*out);
                        }
                        total = total+out;
                    });
                    // 
                    var totalPerson = 0;
                    $.each(_data.users,function(index,user){
                        if(user>0){
                            totalPerson ++;
                        }
                    });
                    // 
                    $.each(_data.users,function(index,user){
                        if(user>0){
                            updateBalanceFunc(balances.eq(index),-1*cominator*total/totalPerson);
                        }
                    });
                }
                // 排序
                window.balance.details.sort(function(a,b){
                    return new Date(a.date).getTime()-new Date(b.date).getTime();
                });
                var strJson = window.JSON.stringify(window.balance);
                    $(".js-detail").val(strJson);
                //
                var db = window.localStorage;
                db.setItem("output",strJson);
            };
            function  updateBalanceFunc(_ele,_value){
                var ele = $(_ele);
                var oldVal = parseInt(ele.text());
                ele.text(oldVal+_value);
            };
            function createTip(_bfObject){
                 // 具体的提示
                var tips = "";
                if(_bfObject.date){
                    tips += "于<label class='f-instant-edit t-flow-date'>"+_bfObject.date+"</label>,";
                }
                //
                if(_bfObject.location){
                    tips += "在<label contenteditable ='true' class='f-instant-edit t-flow-location'>"+_bfObject.location+"</label>,";
                }

                tips +="<label class='f-instant-edit t-flow-outer'>";
                var tmp= [];
                var total = 0;
                $.each(_bfObject.outs,function(index,item){
                    var val = parseInt(item); 
                    if(isNaN(val) || val==0) return;
                    total += val;
                    tmp.push(window.balance.candicates[index]);
                });
                tips += tmp.join("、");
                tips +="</label>";

                tips += "为<label class='f-instant-edit t-flow-user'>";
                var tmp= [];
                $.each(_bfObject.users,function(index,item){
                    if(item){
                        tmp.push(window.balance.candicates[index]);
                    }
                });
                tips += tmp.join("、");
                tips += "</label>,";
                
                if(_bfObject.desc){
                    tips += "购买<label contenteditable ='true' class='f-instant-edit t-flow-desc'>"+_bfObject.desc+"</label>,";
                }
                tips += "支出了<label contenteditable ='true' class='f-instant-edit t-flow-total'>"+total+"</label>";
                //
                var l = $("<div>");
                l.attr("id",_bfObject.id);
                l.html("<a class='w-link'>删除</a>"+tips);
                var button = l.find("a");
                button.click(function(event){
                    l.remove();
                    //
                    $.each(window.balance.details,function(index,_bf){
                        if(_bf.id==_bfObject.id){
                            window.balance.details.splice(index,1);
                            return false;
                        }
                    });
                    // 同步数据和源码的显示
                    syncData("d",_bfObject);
                });
                //
                return l;
            };
            function syncPerson(){
                 $(".js-person").children().each(function(index,item){
                    balance.candicates[index] = item.innerHTML;
                });
            };
            function addPerson(_userName){
                var clone = $(".js-person-sample").clone().removeClass("js-person-sample");
                clone.text(_userName);
                // 人数
                $(".js-person").append(clone);
                // 总计框
                $(".js-balance").append($(".js-balance-sample").clone().removeClass("js-balance-sample"));
                // 输入框
                $(".js-flow").append($(".js-flow-sample").clone().removeClass("js-flow-sample"));
                // 
                syncPerson();
            }
            window.onload=function(){
                // var personEles = $(".js-person").children();
                syncPerson();
                //
                $(".js-person").delegate("button","click",function(event){
                        $(this).toggleClass("btn-success");
                        return true;
                });
                //

                $(document.body).delegate(".f-instant-edit","click",function(event){
                        var site = $(this);
                        var id = site.parent().attr("id");
                        var older = null;
                        $.each(window.balance.details,function(index,detail){
                            if(detail.id==id){
                                older = detail;
                                return false;
                            }
                        });

                        if(site.hasClass("t-flow-location")){
                            var newVal = window.prompt("输入新值");
                            older.location = newVal;
                            site.parent().find(".t-flow-location").text(newVal);
                        }else if(site.hasClass("t-flow-desc")){
                            older.desc = window.prompt("输入新值");
                            site.parent().find(".t-flow-desc").text(older.desc);
                        }
                        return true;
                });
                //
                // var balanceEles = $(".js-balance").children();
                // var flowEles = $(".js-flow").children();
                // 导入数据
                $(".js-flow-inputall").click(function(){
                    if(window.location.href.indexOf("hite.me")>-1){
                        var aid = 1369062304;
                    }else{
                        var aid = 1368979711;
                    }
                    var params = window.location.search.replace("?","").split("=");
                    for(var i=0;i<params.length;i=i+2){
                        if(params[i]=="activeid"){
                            aid = params[i+1];
                            break;
                        }
                    }
                    $.ajax("ajax/search.php",{
                        data:{activeid:aid},
                        success:function(_res){
                            if(_res.code == "S_OK"){
                                window.balance =  _res.data;
                                // 生成参与者
                                $.each(window.balance.candicates,function(index,item){
                                    addPerson(item);
                                });
                                // 生成数据
                                var details = window.balance.details;
                                //
                                var inputZone = $(".js-flow-wrap");
                                $.each(details,function(index,bfObject){
                                    inputZone.after(createTip(bfObject));
                                    // 计算总值
                                    syncData("a",bfObject);
                                });
                            }
                        }
                    });
                });

                //
                var sample = $(".js-flow-wrap");
                // 点击计算按钮
                $(".js-add").click(function(event){
                    var total = 0;
                    // 计算总值
                    $(".js-flow").children().each(function(index,item){
                        var val = parseInt(item.value); 
                        if(isNaN(val)) return;
                        total += val;
                    });
                    //
                    if(total==0) return true;
                    
                    // 生成详细数据
                    var bfObject = {id:"bf_"+new Date().getTime()};
                    // 这次钱的受益者
                    bfObject.users = [];
                    $(".js-person").children().each(function(index,item){
                        bfObject.users[index] = $(item).hasClass("btn-success")?1:0;
                    });
                    // 这次出钱的人
                    bfObject.outs = [];
                    // cloned.find(".js-flow-desc").val();http://bugs.jquery.com/ticket/3016
                    sample.find(".js-flow").children().each(function(index,item){
                        bfObject.outs[index] = parseInt(item.value);
                    });
                    
                    bfObject.date =  sample.find(".js-flow-date").val();
                    bfObject.location =  sample.find(".js-flow-location").val();
                    bfObject.desc =  sample.find(".js-flow-desc").val();

                    // bfObject.tips = tips;
                    //
                    window.balance.details.push(bfObject);
                    // 清空
                    $(".js-flow").children().each(function(index,item){
                        item.value = 0;
                    });
                    // 将历史滚动到下面，
                    sample.after(createTip(bfObject));
                    //
                    // 同步数据和源码的显示
                    syncData("a",bfObject);

                });
                // 点击增加人数
                $(".js-add-person").click(function(){
                    var userName = window.prompt("输入要增加的人名，例如希德");
                    if(userName==null) return ;

                    addPerson(userName);
                });
                // 持久化
                $(".js-save").click(function(){
                    $.ajax("ajax/save.php",{
                        data:{
                            codesource:$(".js-detail").val(),
                            contentType : "application/x-www-form-urlencoded; charset=utf-8"
                        },
                        method:"post",
                        success:function(_data){
                            alert("请copy下url："+window.location.href.split("?")[0]+"?activeid="+_data["activeid"]);
                        }
                    })
                });

            };