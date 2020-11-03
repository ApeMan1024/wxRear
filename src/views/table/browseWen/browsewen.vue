<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title co">文章标题:</span><span class="co">{{row.title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="$router.go(-1)">返回上一级</el-button>
      </div>
      <div>
        <markdown-editor v-model="nei.content1" height="600px" />
      </div>
    </el-card>
  </div>
</template>
<script>
import MarkdownEditor from "../../../components/MarkdownEditor";
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      nei: {
        content1: "",
      },
    };
  },
  components: {
    MarkdownEditor,
  },
  async created() {
    if (Object.keys(this.row).length) {
      sessionStorage.setItem("row", JSON.stringify(this.row));
    } else {
        this.row= JSON.parse(sessionStorage.getItem("row"))
    }
    await this.getWenNei();
  },
  methods: {
    async getWenNei() {
      let { id, title, time } = this.row;
      let { nei } = this;
      let { data: res } = await this.$http
        .post("/wenmd", { id })
        .catch((err) => err);
      if (res.code === 200) {
        nei.title = title;
        nei.id = id;
        nei.time = time;
        nei.content1 = res.data.md;
        return;
      }
      this.$message.error("获取文章内容失败");
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
.el-card__body {
  padding: 0px;
}
.co{
    &.title{
        margin-right:5px;
        font-size:16px;
    }
    color:rgb(32, 160, 255);
    font-size:14px;
}
</style>