<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<script>
export default {
  props:{
    imgbool:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      imageUrl: "",
      action: this.$http.defaults.baseURL + "/imgupdate",
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        let { data: result } = res;
        let filename = result.filename;
        sessionStorage.setItem("imgname",filename)
        this.$emit("upload", filename);
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    async beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if(isJPG && isLt2M){
        let filename=sessionStorage.getItem("imgname")
        if(filename){
          await this.$http.post("/delimg",{
            src1:sessionStorage.getItem("imgname")
          })
        }
      }
      return isJPG && isLt2M;
    },
  },
  watch:{
    imgbool(newBool){
          if(!newBool){
              this.imageUrl=""
          }
      }
  }
};
</script>