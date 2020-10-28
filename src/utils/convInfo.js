var convInfo = function convInfoInit() {
  try {
    lpTag.external = lpTag.external || {};
    lpTag.external.convInfo = {
      getData: function getData() {
        var convEvents = lpTag.events.hasFired("lpUnifiedWindow", "conversationInfo");
        var windowStateEvents = lpTag.events.hasFired("lpUnifiedWindow", "state");
        var renderEvents = lpTag.events.hasFired("RENDERER_STUB", "AFTER_CREATE_ENGAGEMENT_INSTANCE");
        var engagementClicks = lpTag.events.hasFired("LP_OFFERS", "OFFER_CLICK");
        var displayedEngagements = renderEvents.map(this._extractEngDetails) || [];
        var latestEngagementClick = this._getLatest(engagementClicks) || {};
        var clickedEngagementRender = this._findRenderEvent(renderEvents, latestEngagementClick.engagementId) || {};
        var clickedEngagement = this._extractEngDetails(clickedEngagementRender);
        var lpVidCookie = document.cookie.split("; ").find(function (row) {
          return row.startsWith("LPVID");
        });
        var lpSidCookie = document.cookie.split("; ").find(function (row) {
          return row.startsWith("LPSID - ".concat(lpTag.site));
        });
        var lpVid = lpVidCookie ? lpVidCookie.split("=")[1] : undefined;
        var lpSid = lpSidCookie ? lpSidCookie.split("=")[1] : undefined;
        var ceVid = this._getLatest(convEvents, "visitorId");
        var pid = lpVid !== ceVid ? ceVid : undefined;
        return {
          clickedEngagement: clickedEngagement,
          latestSkillId: this._getLatest(convEvents, "skill"),
          latestAgentId: this._getLatest(convEvents, "agentId"),
          latestConvId: this._getLatest(convEvents, "conversationId"),
          latestAgentName: this._getLatest(convEvents, "agentName"),
          latestWindowState: this._getLatest(windowStateEvents, "state"),
          displayedEngagements: displayedEngagements,
          lpSid: lpSid,
          lpVid: lpVid,
          pid: pid,
          siteId: lpTag.site,
          sections: lpTag.section
        };
      },
      renderData: function renderData(data) {
        try {
          var html = '';
          Object.entries(data).forEach(function (entry) {
            const key = entry[0];
            const value = entry[1];
            html += `
            <div style="display:flex; width: 80%;background-color: rgb(0,0,0,.05);margin-left: 10px;margin-right: 10px;border-bottom: 1px solid rgb(0,0,0,.05);padding: 2px 5px;">
              <div style="width: 50%; color:rgb(0,0,0,.7);">${key}</div>
              <div style="width: 50%">${value}</div>
            </div>
            `
            return html;
          });
        } catch {
          return '';
        }
      },
      showData: function showData(opts) {
        if (opts && opts.data && opts.data.line && opts.data.line.text === "/convinfo") {
          var data = lpTag.external.convInfo.getData();
          console.log(data);
          var div = document.createElement("div");
          div.id = "lp_line_convinfo";
          div.innerHTML = renderData(data);
          document.getElementsByClassName("lpc_transcript")[0].appendChild(div);
          opts.data.line.text = "";
          var scrollable = document.getElementsByClassName("lp_location_center")[0];
          scrollable.scrollTop = scrollable.scrollHeight;
        }
      },
      _getLatest: function _getLatest(array, datum) {
        var event = undefined;
        if (datum) {
          for (var i = array.length - 1; i >= 0; i--) {
            if (array[i].data && array[i].data[datum]) {
              event = array[i];
              break;
            }
          }
        } else event = array[array.length - 1];
        if (event && event.data) return datum ? event.data[datum] : event.data;
        else return undefined;
      },
      _findRenderEvent: function _findRenderEventConf(renderEvents, engagementId) {
        return renderEvents.find(function (ev) {
          return ev && ev.data && ev.data.conf && ev.data.conf.id === engagementId;
        });
      },
      _extractEngDetails: function _returnEngDetails(renderEvent) {
        var eng = renderEvent.data && renderEvent.data.eng;
        if (eng && eng.conf) {
          var details = {
            campaignId: eng.conf.campaignId,
            engagementId: eng.conf.id,
            engagementName: eng.conf.name,
            skillId: eng.conf.skillId,
            skillName: eng.conf.skillName,
            container: eng.mainContainer,
            windowId: eng.conf.windowId
          };
        }
        return details;
      },
    };
    lpTag.hooks.push({
      name: "BEFORE_SEND_VISITOR_LINE",
      callback: lpTag.external.convInfo.showData
    });
  } catch (e) {
    console.log(e, "convinfo error");
  }
}


module.exports = convInfo;