(window.webpackJsonp=window.webpackJsonp||[]).push([[168],{1294:function(e,t,n){"use strict";n.d(t,"a",(function(){return U}));var r=n(8),a=n.n(r),i=n(9),c=n.n(i),o=n(5),u=n.n(o),s=n(13),l=n.n(s),f=n(15),p=n.n(f),d=n(6),v=n.n(d),h=n(1),m=n.n(h),y=n(0),k=n.n(y),w=n(480),b=n(1130),R=n(1296),x=n.n(R),S=n(542),D=n(1292),C=n(1285),E=n(1306);function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v()(e);if(t){var a=v()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return p()(this,n)}}var U=function(e){l()(n,e);var t=g(n);function n(){var e;a()(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return e=t.call.apply(t,[this].concat(i)),m()(u()(e),"state",e.getInitialState()),m()(u()(e),"onMediaDisplayed",(function(){var t=e.props.item;S.a.emit("media-viewed",{fileId:t.id,viewingLevel:"full"})})),e}return c()(n,[{key:"componentDidMount",value:function(){this.init()}},{key:"componentWillUnmount",value:function(){this.release()}},{key:"UNSAFE_componentWillReceiveProps",value:function(e){this.needsReset(e,this.props)&&(this.release(),this.setState(this.initialState))}},{key:"componentDidUpdate",value:function(e){this.needsReset(e,this.props)&&this.init()}},{key:"render",value:function(){var e=this;return this.state.content.match({pending:function(){return k.a.createElement(C.a,null)},successful:function(t){return e.renderSuccessful(t)},failed:function(t){var n=e.props.item;return k.a.createElement(D.a,{fileId:n.id,fileState:n,error:t,supressAnalytics:!0},k.a.createElement("p",null,k.a.createElement(w.a,b.a.try_downloading_file)),e.renderDownloadButton(t))}})}},{key:"getInitialState",value:function(){return this.initialState}},{key:"renderDownloadButton",value:function(e){var t=this.props,n=t.item,r=t.mediaClient,a=t.collectionName;return k.a.createElement(E.b,{fileState:n,mediaClient:r,error:e,collectionName:a})}},{key:"needsReset",value:function(e,t){return!x()(e.item,t.item)||e.mediaClient!==t.mediaClient||e.collectionName!==t.collectionName}}]),n}(k.a.Component)},1352:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(20),a=n.n(r),i=n(11),c=n.n(i),o=n(166),u=function(){var e=a()(c.a.mark((function e(t){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(o.a)(t)){e.next=14;break}if(!(n=t.preview)){e.next=14;break}return e.prev=3,e.t0=URL,e.next=7,n;case 7:return e.t1=e.sent.value,e.abrupt("return",e.t0.createObjectURL.call(e.t0,e.t1));case 11:return e.prev=11,e.t2=e.catch(3),e.abrupt("return",void 0);case 14:return e.abrupt("return",void 0);case 15:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(t){return e.apply(this,arguments)}}()},2059:function(e,t,n){"use strict";n.r(t),n.d(t,"DocViewer",(function(){return g}));var r=n(20),a=n.n(r),i=n(8),c=n.n(i),o=n(9),u=n.n(o),s=n(13),l=n.n(s),f=n(15),p=n.n(f),d=n(6),v=n.n(d),h=n(11),m=n.n(h),y=n(0),k=n.n(y),w=n(166),b=n(2036),R=n(1281),x=n(1285),S=n(1294),D=n(1352);function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v()(e);if(t){var a=v()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return p()(this,n)}}var E=function(){return Promise.all([n.e(26),n.e(72)]).then(n.bind(null,1505)).then((function(e){return e.PDFRenderer}))},g=function(e){l()(i,e);var t,n,r=C(i);function i(){return c()(this,i),r.apply(this,arguments)}return u()(i,[{key:"initialState",get:function(){return{content:b.a.pending()}}},{key:"init",value:(n=a()(m.a.mark((function e(){var t,n,r,a,c,o,u,s;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i.PDFComponent){e.next=3;break}return e.next=3,this.loadDocViewer();case 3:if(t=this.props,n=t.item,r=t.mediaClient,a=t.collectionName,c=t.onError,!Object(w.d)(n)){e.next=14;break}return e.next=7,Object(D.a)(n);case 7:if(o=e.sent){e.next=11;break}return this.setState({content:b.a.pending()}),e.abrupt("return");case 11:this.setState({content:b.a.successful(o)}),e.next=28;break;case 14:if("processed"!==n.status){e.next=28;break}return e.prev=15,e.next=18,r.file.getArtifactURL(n.artifacts,"document.pdf",a);case 18:u=e.sent,this.onMediaDisplayed(),this.setState({content:b.a.successful(u)}),e.next=28;break;case 23:e.prev=23,e.t0=e.catch(15),s=new R.b("docviewer-fetch-url",e.t0),this.setState({content:b.a.failed(s)}),c&&c(s);case 28:case"end":return e.stop()}}),e,this,[[15,23]])}))),function(){return n.apply(this,arguments)})},{key:"loadDocViewer",value:(t=a()(m.a.mark((function e(){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E();case 2:i.PDFComponent=e.sent,this.forceUpdate();case 4:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})},{key:"release",value:function(){var e=this.state.content;e.data&&URL.revokeObjectURL(e.data)}},{key:"renderSuccessful",value:function(e){var t=this.props,n=t.item,r=t.onClose,a=t.onSuccess,c=t.onError,o=i.PDFComponent;return o?k.a.createElement(o,{item:n,src:e,onSuccess:a,onError:c,onClose:r}):k.a.createElement(x.a,null)}}]),i}(S.a)}}]);
//# sourceMappingURL=168.bundle.js.map