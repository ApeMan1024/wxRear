<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="action"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传md文件</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    filebool: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileList: [],
      action: this.$http.defaults.baseURL + "/fileupdate",
      filename: "",
      nei: {
        content1: "",
        wenNeidialogVisible: false,
      },
    };
  },
  methods: {
    handleSuccess(res) {
      if (res.code === 200) {
        this.filename = res.data.filename;
        sessionStorage.setItem("filename", this.filename);
        this.$emit("upload", this.filename);
      }
    },
    async handleRemove() {
      await this.$http.post("/delfile", { filename: this.filename });
    },
    async handlePreview(file) {
      this.$emit("edit")
    },
    beforeAvatarUpload(file) {
      const isfileType = file.type === "md";
      if (file.name) {
        let arrpath = file.name.split(".");
        let type = arrpath[arrpath.length - 1];
        if (type === "md") {
          return true;
        }
      }
      this.$message.error("只允许上传md类型的文件");
      return false;
    },
  },
  watch: {
    filebool(newBool) {
      if (!newBool) {
        this.fileList = [];
      }
    },
  },
};
</script>
<style lang="scss">
.tui-editor .te-md-splitter {
  width: 100%;
}
.tui-editor-defaultUI .te-switch-button {
  width: 93px;
}
.tui-editor-defaultUI .wysiwyg {
  display: none;
}
</style>