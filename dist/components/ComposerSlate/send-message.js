"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _slateHtmlSerializer=_interopRequireDefault(require("slate-html-serializer")),_slatePlainSerializer=_interopRequireDefault(require("slate-plain-serializer")),_react=_interopRequireWildcard(require("react")),_commonmark=_interopRequireDefault(require("commonmark")),_reactHtmlParser=_interopRequireDefault(require("react-html-parser")),_markdown=require("../../plugins/markdown");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={};if(null!=a){var d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}}return c["default"]=a,b&&b.set(a,c),c}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var BLOCK_TAGS={blockquote:"quote",p:"paragraph",pre:"code"},MARK_TAGS={em:"italic",strong:"bold",u:"underline"},mentions=[],groupMentions=[],addNewLine=function(a){if(a.length){var b=a[a.length-1];b&&(a[a.length-1]="".concat(b,"\n"))}return a},convertMarkdownToHTML=function(a){var b=new _commonmark["default"].Parser,c=new _commonmark["default"].HtmlRenderer,d=b.parse(a),e=c.render(d);return e=e.replace(/^<p>([\s\S]*)<\/p>\s$/,"$1"),_react["default"].createElement(_react["default"].Fragment,null,(0,_reactHtmlParser["default"])(e))},cleanUpContent=function(a){var b=a;// Remove the last unwanted \n in a code block
return b=b.replace(/\n<\/code>/,"</code>"),b=b.replace(/<code>/g,"<code class=\"language-none\">"),b=b.replace(/<div><\/div>/g,"<br>"),b},blocks={blockquote:_react["default"].createElement("blockquote",null),"unordered-list":_react["default"].createElement("ul",null),"ordered-list":_react["default"].createElement("ol",null),"list-item":_react["default"].createElement("li",null),h1:_react["default"].createElement("h1",null),h2:_react["default"].createElement("h2",null),h3:_react["default"].createElement("h3",null),h4:_react["default"].createElement("h4",null),h5:_react["default"].createElement("h5",null),hr:_react["default"].createElement("hr",null)},rules=[{deserialize:function deserialize(a,b){var c=BLOCK_TAGS[a.tagName.toLowerCase()];if(c)return{object:"block",type:c,data:{className:a.getAttribute("class")},nodes:b(a.childNodes)}},serialize:function serialize(a,b){if("block"===a.object)switch(a.type){case"paragraph":return _react["default"].createElement("div",{className:a.data.get("className")},b);case"code":{var e=a.data.get("language")||"none";return _react["default"].createElement("pre",null,_react["default"].createElement("code",{className:"language-".concat(e)},b))}case"plain":return _react["default"].createElement(_react["default"].Fragment,null,b);case"blockquote":case"list-item":case"unordered-list":case"h1":case"h2":case"h3":case"h4":case"h5":return(0,_react.cloneElement)(blocks[a.type],{},b);case"ordered-list":return(0,_react.cloneElement)(blocks[a.type],{start:a.data.get("start")},b);case"hr":return(0,_react.cloneElement)(blocks[a.type]);default:return null;}else if("inline"===a.object&&"userMention"===a.type){var c=a.data.get("id"),d=a.data.get("objectType");return"groupMention"===d?(groupMentions.push({groupType:c,objectType:d}),_react["default"].createElement("spark-mention",{"data-object-type":d,"data-group-type":c},a.data.get("mentionDisplay"))):(mentions.push({id:c,objectType:d}),_react["default"].createElement("spark-mention",{"data-object-type":d,"data-object-id":c},a.data.get("mentionDisplay")))}}},// Add a new rule that handles marks...
{deserialize:function deserialize(a,b){var c=MARK_TAGS[a.tagName.toLowerCase()];if(c)return{object:"mark",type:c,nodes:b(a.childNodes)}},serialize:function serialize(a,b){if("mark"===a.object)switch(a.type){case"bold":return _react["default"].createElement("strong",null,b);case"italic":return _react["default"].createElement("em",null,b);case"underline":return _react["default"].createElement("u",null,b);case"code":return _react["default"].createElement("code",{className:"language-none"},b);case"url":return convertMarkdownToHTML(b[0]);case"plain":return _react["default"].createElement(_react["default"].Fragment,null,addNewLine(b));case"clear":return _react["default"].createElement(_react["default"].Fragment,null,b);case"delete":return _react["default"].createElement(_react["default"].Fragment,null);default:return null;}}}],html=new _slateHtmlSerializer["default"]({rules:rules}),serializePlugin=function(a){var b=function(a,b){a.props.notifyKeyDown&&a.props.notifyKeyDown(b)};return{onKeyDown:function onKeyDown(a,c,d){return a.shiftKey?(b(c,a),d()):"Enter"===a.key?(a.preventDefault(),c.sendMessage(),!0):(b(c,a),d())},commands:{sendMessage:function sendMessage(b){var c=_slatePlainSerializer["default"].serialize(b.value);(0,_markdown.convertMarkdown)({editor:b});var d=cleanUpContent(html.serialize(b.value)),e={displayName:c,content:d};mentions.length&&(e.mentions=mentions,mentions=[]),groupMentions.length&&(e.groupMentions=groupMentions,groupMentions=[]),b.props.onChange({value:a}),setTimeout(function(){b.props.send(e),b.focus()})}}}},_default=serializePlugin;// Add a dictionary of mark tags.
exports["default"]=_default;