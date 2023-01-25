import React, { useEffect, useRef } from "react";
import "./styles.css";

export default function App() {
  const wrapper = useRef();
  var domain = "http://127.0.0.1:8881"

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      config: {
        avatarWhiteList: ['knowledge', 'recommend'],
        navbar: {
          title: "智能助理"
        },
        robot: {
          avatar: "//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg"
        },
        user: {
          avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg',
        },
        messages: [
          {
            type: "text",
            content: {
              text: "你好"
            }
          },
          // {
          //   type: "card",
          //   content: {
          //     code: "knowledge",
          //     data: {
          //       text: "智能助理为您服务，请问有什么可以帮您？"
          //     }
          //   },
          //   meta: {
          //     evaluable: true // 是否展示点赞点踩按钮
          //   }
          // }
        ]
      },
      requests: {
        /**
         *
         * 反馈（可选）
         * @param {string} data.msgId - message id
         * @param {string} data.category - 原因
         * @param {string} data.text - 其他原因
         * @return {object}
         */
        send(data) {
          var fd = new FormData();
          fd.append('msg', data.content.text);
          return {
            url: domain + "/message",
            data: {
              msg: data.content.text,
            },
            mimeType: "multipart/form-data",
            type: 'POST',
          };
        },
        /**
         *
         * 反馈（可选）
         * @param {string} data.msgId - message id
         * @param {string} data.category - 原因
         * @param {string} data.text - 其他原因
         * @return {object}
         */
        feedback(data) {
          return {
            url: domain + "/api/feedback",
            data: {
              messageId: data.msgId,
              category: data.category,
              text: data.text
            }
          };
        },
        /**
         *
         * 点赞点踩接口（可选）
         * @param {string} data.msgId - 消息ID
         * @param {string} data.type - 点赞: good, 点踩: bad
         * @return {object}
         */
        evaluate(data) {
          return {
            url: domain + "/api/evaluate",
            data: {
              messageId: data.msgId,
              evaluateType: data.type
            }
          };
        }
      },
      handlers: {
        /**
        *
        * 解析请求返回的数据
        * @param {object} res - 请求返回的数据
        * @param {object} requestType - 请求类型
        * @return {array}
        */
        parseResponse: function (res, requestType) {
          // var re = JSON.parse('{"Messages": [{"Type": "text","RelatedKnowledges":"", "Text": {"Content": ""}}]}');
          // re.Messages[0].Text.Content = res.text;
          // //根据 requestType 处理数据
          // if (requestType === 'send' && re.Messages) {
          //   // 用 isv 消息解析器处理数据
          //   return isvParser({ data: re });
          // }
          // var re = JSON.parse('{"Messages": [{"Type": "knowledge", "Card": {"Content": ""}}]}');
          // re.Messages[0].Card.Content = res.text;



          //不需要处理的数据直接返回
          var evaluable = JSON.parse('{"_id":"","content": {"data":{"text":"请给出评价~"},"code":"knowledge"},"type":"card", "meta": {"evaluable" :"true"}}');
          evaluable._id = res.msgId +"";
          evaluable.content.data.text = res.text + '</br>请给出评价哦~';
          //result.push(evaluable);
          return evaluable;
        },
      },
      feedback: {
        // 点赞后出的文本
        textOfGood: "感谢您的评价，我们会继续努力的哦！",
        // 点踩后出的文本
        textOfBad: "",
        // 点踩后是否显示反馈表单
        needFeedback: true,
        // 不满意原因列表
        options: [
          {
            // 选项值
            value: "我没有得到我想要的答案",
            // 选项显示文本，当与 value 相同时可省略
            label: "我没有得到我想要的答案"
          },
          {
            value: "界面太难用了"
          },
          {
            value: "我不认可这个规则"
          }
        ],
        // 原因是否必选
        isReasonRequired: true,
        // 提交反馈后出的文本
        textAfterSubmit: ""
      }
    });
    bot.run();

  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}
