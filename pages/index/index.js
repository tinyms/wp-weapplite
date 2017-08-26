var api = require('../../utils/api.js')
var http = require('../../utils/http.js')
var wxParse = require('../../wxParse/wxParse.js')
var app = getApp()
Page({
  data: {
    navbar: [],
    currentNavbar: 0
  },

  /**
   * 创建顶部导航栏
   */
  build_top_nav(){
    var data = wx.getStorageSync('wp-pages') || [];
    var nav_bar_titles = [];
    for(var k=0;k<data.length;k++){
      var item = data[k];
      var title = item.title.rendered;
      var id = item.id;
      nav_bar_titles.push({'title':title, 'id':id});
    }
    this.setData({
      'navbar': nav_bar_titles
    });
  },

  onLoad () {
    var that = this;
    that.build_top_nav();
    that.display_page_content(0);
    http.fetch({
      url: api.Pages + '?orderby=menu_order&order=asc',
      success: function (data){
        wx.setStorageSync('wp-pages', data.data);
        that.build_top_nav();
        that.display_page_content(0);
      }
    });
  },

  /**
   * 点击跳转详情页
   */
  onItemClick (e) {
    var targetUrl = 'pages/index/index'
    if (e.currentTarget.dataset.rowId != null)
      targetUrl = targetUrl + '?rowId=' + e.currentTarget.dataset.rowId
      wx.navigateTo({
        url: targetUrl
      })
  },

  display_page_content(idx){
    var that = this;
    var data = wx.getStorageSync('wp-pages') || [];
    for(var k=0;k<data.length;k++){
      if(idx===k){
        var article = data[k].content.rendered;
        console.log(article);
        wxParse.wxParse('wp_page_content', 'html', article, that, 5);
        break;
      }
    }
  },

  /**
   * 切换 navbar
   */
  swichNav (e) {
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    })
    this.display_page_content(this.data.currentNavbar);
  },
})
