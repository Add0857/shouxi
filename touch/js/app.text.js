/**
 * 
 */
var gameType = 
	{
		'sa': {
			'bac': '百家樂',
			'dtx': '龍虎',
			'sicbo': '骰寶',
			'ftan': '番攤',
			'rot': '輪盤',
			'slot': '電子遊藝',
			'lottery': '48 彩/48彩其他玩法',
			'minigame': '小遊戲',
			'multiplayer': '多人遊戲',
		},
		'ab': {
		    '101': '普通百家樂 ',
		    '102': 'VIP 百家樂',
		    '103': '急速百家樂',
		    '104': '競咪百家樂',
		    '201': '骰寶',
		    '301': '龍虎',
		    '401': '輪盤',
		    '501': '歐洲廳百家樂',
		    '601': '歐洲廳輪盤',
		    '701': '歐洲廳21 點',
		},
		'dg': {
		   '11': '百家樂',
		   '13': '龍虎',
		   '14': '輪盤',
		   '15': '骰寶',
		   '17': '牛牛',
		   '18': '競咪百家樂',
		   '19': '賭場撲克,',
		   '21': '會員發紅包',
		   '22': '會員搶紅包',
		   '23': '小費',
		   '24': '公司發紅包',
		},
		'sp': {
			'1': '美棒',
			'2': '日棒',
			'3': '台棒', 
			'4': '韓棒',
			'5': '冰球',
			'6': '籃球',
			'7': '彩球',
			'8': '美足',
			'9': '網球',
			'10': '足球',
			'11': '指數',
			'12': '賽馬',
			'13': '電競',
			'14': '其他',
		},
	};
var betType = {
	'sp': {
		'1': '讓分',
		'2': '大小',
		'3': '獨贏',
		'4': '單雙',
		'5': '一輸二贏',
		'10': '搶首分',
		'11': '搶尾分',
		'13': '單節最高分',
		'20': '過關',
	},
};
var betSection = {
	'sp': {
		'0': '全場',
		'1': '上半場',
		'2': '下半場',
		'3': '第一節',
		'4': '第二節',
		'5': '第三節',
		'6': '第四節',
		'7': '滾球',
		'8': '滾球上半場',
		'9': '滾球下半場',
		'10': '多種玩法',
	},
}; 
		
$app.text = (function($){
	$txt = {
		gameTypes: gameType,
		betTypes: betType,
		betSections: betSection,
        /**
         * 彩種
         */
	    lotteryType: function(type) {
	    	return $app.text.toText({
	    		'A0': '時時彩',
	    		'B0': '11選5',
	    		'C0': '江蘇快三',
	    		'D0': '北京快樂八',
	    		'E0': '北京PK10',
	    		'F0': '福彩3D 排列三',

	    	}, type);
	    },
	    /**
	     * 彩票標示
	     * @param mark
	     * @returns
	     */
		lotteryMark: function(mark) {
			return $app.text.toText({
				'1': '推薦',
				'2': '熱門',
				'3': '新遊戲',
				'4': '官方',
			}, mark);
		},
		/**
		 * 彩票狀態
		 */
	    lotteryState: function(state) {
	    	return $app.text.toText({
	    		'0': '停用', '1': '啟用',
	    	}, state);
	    },
	    /**
	     * 狀態
	     */
	    stateText: function(state) {
	    	return $app.text.toText({
	    		'0': '停用', '1': '啟用',
	    	}, state);
	    },
	    /**
	     * 會員身份
	     */
	    memberRole: function(role) {
	    	return $app.text.toText({
	    		'P': '會員', 'A': '代理', 'S':'總代理',
	    	}, role);
	    },
	    gameRole: function(role) {
	    	return $app.text.toText({
	    		'P': '會員', 'A': '代理',
	    	}, role);
	    },
	    /**
	     * 公告對像
	     */
	    bulletinTarget: function(target) {
	    	return $app.text.toText({
	    		'A': '全站', 'M': '會員',
	    	}, target);
	    },
	    cmStateText: function(state) {
	    	return $app.text.toText({
	    		'1': '待處理',
	    		'2': '處理中',
	    		'3': '結案',
	    		'4': '作廢/不需處理',
	    	}, state);
	    },
	    depositState: function(state) {
	    	return $app.text.toText({
	    		'0': '未付款',
	    		'1': '已付款',
	    		'2': '付款失敗',
	    		'3': '取消',
	    	    '4': '待審核',
	    	    '6': '審核中',
	    	    '5': '審核不過'
	    	}, state);
	    },
	    withdrawalsState: function (state) {
	    	return $app.text.toText({
	    		'0': '待處理',
	    		'1': '完成',
	    		'2': '退件',
	    		'3': '審核中',
	    	}, state);
	    },
	    bankInfoState: function (state) {
	    	return $app.text.toText({
	    		'0': '待審核',
	    		'1': '已驗證',
	    		'2': '未驗證',
	    	}, state);
	    },
	    platformText: function(platform) {
	    	return $app.text.toText({
	    		'lhbet': '主帳戶',
				'sa': '沙龍娛樂',
				'qt': 'QT電子遊戲',
				'ab': '歐博娛樂',
				'dg': 'DG娛樂',
				'og': 'OG娛樂',
				'bo': 'BNG電子遊戲',
				'sp': 'Super體育',
			}, platform);
	    },
	    gameTypeText: function(platform, type) {
	    	if (gameType[platform] != undefined) {
	    		return $app.text.toText(gameType[platform], type);
	    	} 
	    	return type;
	    },
	    betTypeText: function(platform, type) {
	    	if (betType[platform] != undefined) {
	    		return $app.text.toText(betType[platform], type);
	    	} 
	    	return type;
	    },
	    betSectionText: function(platform, section) {
	    	if (betSection[platform] != undefined) {
	    		return $app.text.toText(betSection[platform], section);
	    	} 
	    	return section;
	    },
	    fundsLogKindText: function (kind) {
	    	return $app.text.toText({
	    		"1": '充值',
                "2": '提款',
                "3": '遊戲結果(-)',
                "4": '返點',
                "5": '退單',
                "6": '遊戲結果(+)',
                "7": '退款',
                "8": '優惠/獎勵',
                "10": '投注',
                "11": '轉帳(轉出)',
                "12": '轉帳(轉入)',
                "81": '代理佣金',
                "91": "客服補點",
                "92": "客服扣點",
	    	}, kind);
	    },
	    rollingKindText: function(kind) {
	    	return $app.text.toText({
    			'1': '充值',
    			'4': '返點',
	    		'6': '中獎',
	    		'8': '優惠/獎勵',
	    		"91": "客服補點",
	    	}, kind);
	    },
	    paymentText: function(payment) {
	    	return $app.text.toText(
	    		{
	    	    		'Credit': '信用卡',
	    	    		'WebATM': 'Web ATM',
	    	    		'ATM': '自動櫃員機',
	    	    		'CVS': '超商代碼',
	    	    		'BARCODE':'超商條碼',
	        	}, payment);
	    },
	    vipLevelText: function(level) {
	    	return $app.text.toText(
	    			{
	    				'1': '菁英',
	    				'2': '至尊',
	    				'3': '尊爵',
	    				'4': '帝王',
	    				'5': '傳奇',
	    			}, level);
	    },
		toText: function(text, code) {
			if (text[code]) {
				return text[code];
			}
			return code;
		}
	};
	return $txt;
})(jQuery);
	