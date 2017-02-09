 var requireConfig = {
    baseUrl : "./js",
    paths : {
      'jquery' : "./lib/jquery",
      'cookie' : "./lib/jquery.cookie",
      'template' : './lib/template',
      'layer' : "./lib/layer/layer" ,
      'DatePicker':"./lib/My97DatePicker/WdatePicker", 
      'selectize' : "./lib/selectize/selectize",
      'echart' :"./lib/echarts/dist/echarts-all",
      "echart3.0":"./lib/echarts/echarts.min",
      "zrender":"./lib/zrender/zrender",
      'multiple' : "./lib/multiple/jquery.multiple.select",
      'ztreeall':"./lib/ztree/js/jquery.ztree.all",
      'ztreecode':"./lib/ztree/js/jquery.ztree.core.min",
      'ztreeex':"./lib/ztree/js/jquery.ztree.excheck-3.5.min",
      'ztreeExh':"./lib/ztree/js/jquery.ztree.exhide-3.5.min",
      'ajaxfileupload':"./lib/ajaxfileupload",
      'tooltipster':"./lib/tooltipster/jquery.tooltipster",
      "lodash":"./util/lodash.min",
      'cqGeoCoord':"./lib/cqGeoCoord",
      'remoteCall':"./remoteCall",
      'uploadify':"./lib/uploadify/jquery.uploadify"
    },
    packages : [ 
        {
            name : 'component',
            location : './component',
            main : 'component'
        },
        {
            name: 'easyUI',
            location: 'lib/easyui/js',
            main : 'easyUI'
        }
    ],
    shim:{
      layer :{
        deps : ['jquery'],
        exports: 'window.layer'
      },
      bootstrap :['jquery'],
      selectize :['jquery'],
      cookie : ['jquery'],
      multiple : ['jquery'],
      'easyUI/jquery.datagrid':{
          deps : ['jquery','easyUI/easyuizhCN','easyUI/jquery.pagination','easyUI/jquery.panel','easyUI/jquery.parser', 'easyUI/jquery.resizable','easyUI/jquery.linkbutton'],
          exports : 'jQuery.fn.datagrid'
      },
      'easyUI/easyuizhCN':{
          deps : ['jquery']
      },
      'easyUI/jquery.pagination':{
          deps : ['jquery'],
          exports : 'jQuery.fn.pagination'
      },
      'easyUI/jquery.panel':{
          deps : ['jquery'],
          exports : 'jQuery.fn.panel'
      },
      'easyUI/jquery.parser':{
          deps : ['jquery'],
          exports : 'jQuery.fn.parser'
      },
      'easyUI/jquery.resizable':{
          deps : ['jquery'],
          exports : 'jQuery.fn.resizable'
      },
      'easyUI/jquery.linkbutton':{
          deps : ['jquery'],
          exports : 'jQuery.fn.linkbutton'
      },
      'easyUI/jquery.tabs' : {
          deps : ['jquery'],
          exports : 'jQuery.fn.tabs'
      },
      'easyUI/datagrid-detailview' : {
    	  deps : ['jquery','easyUI/jquery.datagrid'],
          exports : 'jQuery.fn.detailview'
      },
      'easyUI/datagrid-transposedview':{
    	  deps : ['jquery','easyUI/jquery.datagrid'],
          exports : 'jQuery.fn.transposedview'
      },
      ztreeall:{
    	  deps : ['jquery']
      },
      ztreecode:{
    	  deps : ['jquery']
      },
      ztreeex:{
    	  deps : ['jquery']
      },
      ztreeExh:{
    	  deps : ['jquery']
      },
      tooltipster:['jquery']
      ,
      ajaxfileupload:{
    	  deps : ['jquery']
      },
      remoteCall:{
    	  deps : ['jquery']
      }
      
    }
};
