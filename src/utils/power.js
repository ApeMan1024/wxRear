//权限表
let power={
    1:["读写文章","编辑文章","删除文章"],
    2:["读写文章","编辑文章"],
    3:["读写文章","删除文章"],
    4:["读写文章"],
    5:["编辑文章","删除文章"],
    6:["编辑文章"],
    7:["删除文章"]
}

//获取管理员权限
function getPower(checkList){
    for(let [key,val] of Object.entries(power)){
        if(checkList.length!==val.length){
            continue;
        }
        let bool=checkList.every(item=>{
            return val.some(ite=>{
                return ite===item;
            });
        });
        if(bool){
            return key;
        }
    }
    return 0;
}

function getCheckList(num){
    return power[num];
}

export{
    getCheckList,getPower
};