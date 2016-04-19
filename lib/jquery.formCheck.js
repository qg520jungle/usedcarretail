/**
 * Created by ly-zhangxianggeng on 2015/11/17.
 *
 * 0.12取消触发方式，调用即验证，提供返回结果及回调函数
 * 0.13希望可以实现更简单的调用方法
 *
 */

;
(function($) {
	$.fn.formCheck = function(options) {
		return this.each(function(index, el) {
			// 这里开始写功能需求
			//重写默认值信息
			var defaultOptions = {
				//验证模式
				checkModel: 'nameCheck',
				//验证规则 包括ref 是否必选
				required: true, //是否为必选项，为bool值，若为是，作为验证判断
				// 若为否，仅当非空的做判断
				//触发模式
				//submitModel:'',
				nMin: 1, //仅当其验证名字时起作用，
				// 考虑取消或者可以延伸到所有验证，或者单独写入名字验证中
				nMax: 4,
				ref: '', //自定义验证正则
				//自定义消息内容
				passMsg: 'ispass',
				msg: '请正确输入',
				emptyMsg: '不能为空'
					//showError:'showErrorFollow',
					//clearError:'clearErrorFollow'
			};
			//默认的返回消息数组
			var arrMsg = {
				nameCheck: {
					namePassMsg: 'isPass',
					nameMsg: '请输入正确的姓名',
					nameEmptyMsg: '请输入姓名'
				},
				phoneCheck: {
					phonePassMsg: 'isPass',
					phoneMsg: '请输入正确的电话号码',
					phoneEmptyMsg: '请输入电话号码'
				},
				IDCheck: {
					IDPassMsg: 'isPass',
					IDMsg: '请输入正确的身份证号码',
					IDEmptyMsg: '请输入身份证号码'
				},
				emailCheck: {
					emailPassMsg: 'isPass',
					emailMsg: '请输入正确格式的邮箱',
					emailEmptyMsg: '请输入邮箱'
				},
				userNameCheck: {
					userNamePassMsg: 'isPass',
					userNameMsg: '请输入正确格式的用户名',
					userNameEmptyMsg: '请输入用户名'
				},
				notEmptyCheck: {
					notEmptyPassMsg: 'isPass',
					notEmptyMsg: '此项不能为空',
					notEmptyEmptyMsg: '您未输入，此项不能为空'
				},
				passwordCheck: {
					passwordPassMsg: 'isPass',
					passwordMsg: '请输入正确格式的密码',
					passwordEmptyMsg: '密码不能为空'
				}
			};
			var obj = $.extend({}, defaultOptions, options);
			var isPass = false;
			var isEmpty = false;
			var typeError = false;
			var s = '';
			var refSelf = obj.ref;
			var This = this;
			var resultBool = false; //默认返回值为false;
			$(This).attr('data-xg-res', '');
			//触发验证方式
			$(This).on('click', function() {
				isPass = false;
				isEmpty = false;
				typeError = false;
				s = '';
				$(This).attr('data-xg-msg', '验证中,请稍后...');
			});
			//$(This).on('blur', function() {
				///forCheck();
				//beResult();
				//showResult();

			//});
			$('.submitAll').on('click', function() {
				var bb = $(this).parents('.needCheck').find('[data-xg-res]');
				//提交验证，只在提交时获取所有的data-xg-res的值，在所有错误的后面显示，优先显示最上面的
				forCheck();
				beResult();
				console.log(bb);
				console.log(resultBool);
				if (!resultBool) {
					showResult();
				}
				bb.each(function(index, el) {
					if (!$(el).get(0).resultBool) {
						$(el).parents('.needCheck').find('.u-xg-tips').text($(el).attr('data-xg-msg')).show();
						return false;
					}
				});
			});

			//判断是否为input框或者div,以获得目标验证字符串
			function thisTypeVal() {
				if ($(This).val().length > 0) {
					return $(This).val();
				} else {
					return $(This).text();
				}
			}
			//判断验证结果，返回属性性的值
			function typeCheck(PassMsg, Msg, EmptyMsg) {
				if (!isPass && !isEmpty) {
					$(This).attr('data-xg-msg', Msg);
					// obj.showError(Msg);
					$(This).attr('data-xg-res', 'typeError');
					//console.log('typeError');
				} else if (!isPass) {
					$(This).attr('data-xg-msg', EmptyMsg);
					$(This).attr('data-xg-res', 'isEmpty');
					//obj.showError(EmptyMsg);
					// console.log('isEmpty');
				} else {
					$(This).attr('data-xg-msg', PassMsg);
					$(This).attr('data-xg-res', 'isPass');
					//obj.showError(PassMsg);
					// console.log('isPass');
				}
			}
			/*判断类型，以确定返回消息为默认值，或是用户自定义*/
			function chooseMsg(PassMsg, Msg, EmptyMsg) {
				if (options.passMsg) {} else {
					obj.passMsg = PassMsg;
				}
				if (options.msg) {} else {
					obj.msg = Msg;
				}
				if (options.emptyMsg) {} else {
					obj.emptyMsg = EmptyMsg;
				}
			}

			/*判断函数
			 *
			 * */
			function forCheck() {
				s = thisTypeVal();
				s = trim(s);
				switch (obj.checkModel) {
					case 'nameCheck':
						isPass = chnName(s, obj.nMin, obj.nMax);
						break;
					case 'phoneCheck':
						isPass = phnNumber(s);
						break;
					case 'IDCheck':
						isPass = idConfir(s);
						break;
					case 'emailCheck':
						isPass = emailConfir(s);
						break;
					case 'userNameCheck':
						isPass = userNameConfir(s);
						break;
					case 'notEmptyCheck':
						isPass = thisNotEmpty(s);
						break;
					case 'passwordCheck':
						isPass = passwordConfir(s);
						break;
					default:
						console.log('验证模式错误！')
						break;
				}
				//通过模式判断对应的提示信息
				var arrMsgNews = [];
				for (var key in arrMsg) {
					if (key == obj.checkModel) {
						for (var key2 in arrMsg[key]) {
							arrMsgNews.push(arrMsg[key][key2]);
						}
						chooseMsg(arrMsgNews[0], arrMsgNews[1], arrMsgNews[2]);
					}
				}
				typeCheck(obj.passMsg, obj.msg, obj.emptyMsg);
			}
			///////////////////////////////错误信息显示模块//////////////////////////////////////////////////////
			function showResult() {
				var $tips = $(This).parents('.needCheck').find('.u-xg-tips');
				var $span='<span class="xg-fc-backmsg">';
				$span+=$(This).attr('data-xg-msg');
				$span+='</span>';
				if($(This).next().hasClass('xg-fc-backmsg')){
					$(This).next('.xg-fc-backmsg').text($(This).attr('data-xg-msg'));
				}else{
					$(This).after($span);
				}
				if (resultBool) {
					$(This).next('.xg-fc-backmsg').hide();
				} else {
					$(This).next('.xg-fc-backmsg').show();
				}
			}
			///////////////////////////////返回通过////////////////////////////////////////////////////////////////////
			function beResult() {
				if (obj.required) {
					if (($(This).attr('data-xg-res')) && ($(This).attr('data-xg-res')) != 'isPass') { //判断条件如果没通过 则标记值为false
						resultBool = false;
					} else {
						resultBool = true;
					}
				} else {
					if (($(This).attr('data-xg-res')) && ($(This).attr('data-xg-res')) == 'typeError') { //判断条件如果没通过 则标记值为false
						resultBool = false;
					} else {
						resultBool = true;
					}
				}
				$(This).get(0).resultBool = resultBool;
			}
			/*去前后的空白符
			 *
			 * */
			/*去掉开头结尾空格*/
			function trim(str) {
				var reg = /^\s*(.*?)\s*$/;
				str = str.replace(reg, "$1");
				return str;
			}
			/*中文姓名验证
			 *参数nMin,nMax 为需要的姓名字数
			 */
			function chnName(s, nMin, nMax) {
				s += '';
				var ref = refSelf ? refSelf : '/^[\u4e00-\u9fa5]{' + nMin + ',' + nMax + '}$/';
				if (s) {
					isEmpty = false;
					return s.match(eval(ref)) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*手机验证
			 *
			 *
			 */
			function phnNumber(s) {
				s += '';
				var refphone = refSelf ? refSelf : /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
				//console.log(refphone);
				if (s) {
					isEmpty = false;
					return s.match(refphone) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*身份证验证
			 *
			 */
			function idConfir(s) {
				s += '';
				//身份证正则表达式(15位)
				var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
				//身份证正则表达式(18位)
				var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
				if (s) {
					isEmpty = false;
					if (s.match(isIDCard1) || s.match(isIDCard2)) {
						return true;
					} else {
						return false;
					}
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*邮箱验证
			 *
			 */
			function emailConfir(s) {
				s += '';
				var emailName = refSelf ? refSelf : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (s) {
					isEmpty = false;
					return s.match(emailName) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*用户名验证
			 *
			 * */
			function userNameConfir(s) {
				s += '';
				var userName = refSelf ? refSelf : /^[a-zA-Z0-9]{6,16}$/;
				if (s) {
					isEmpty = false;
					return s.match(userName) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*为空验证
			 *
			 * */
			function thisNotEmpty(s) {
				s += '';
				var thisvalue = refSelf ? refSelf : /^\S*$/;
				if (s) {
					isEmpty = false;
					return s.match(thisvalue) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			/*密码验证
			 *
			 * */
			function passwordConfir(s) {
				s += '';
				var password = refSelf ? refSelf : /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*.,;'"/?+=-]).{6,16}/;
				if (s) {
					isEmpty = false;
					return s.match(password) ? true : false;
				} else {
					isEmpty = true;
					return false;
				}
			}
			// beResult();
			// return resultBool;
    forCheck();
	beResult();
	showResult();
		})
	};

})(jQuery);
