/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
Ext.define('Wdesktop.app.AppManager.view.HotRankApplication', {
	extend : 'Ext.grid.Panel',
	alias : "widget.hotRankApplication",
	requires : [ 'Ext.grid.View', 'Ext.toolbar.Paging',
			'Ext.selection.CheckboxModel', 'Ext.grid.column.Number',
			'Ext.grid.column.Template',
			'Wdesktop.app.AppManager.view.InstallPanel'],

	closable : true,
	title : '人气排名应用',
	titleAlign : 'center',
	columnLines : true,
	multiSelect : true,
	emptyText : '没有应用信息',

	initComponent : function() {
		var me = this;
		me.store = me.getApplicationStore();
		me.contextMenu = me.createContextMenu();
		Ext.applyIf(me, {
			dockedItems : [ {
				xtype : 'pagingtoolbar',
				dock : 'bottom',
				store : me.store,
				displayInfo : true,
				items : [ {
					xtype : 'button',
					height : 30,
					text : '安装选中的应用',
					handler:me.onInstallButtonClick
				}]
			}],
			selModel : Ext.create('Ext.selection.CheckboxModel', {

			}),
			columns : [ {
				xtype : 'gridcolumn',
				align : 'center',
				dataIndex : 'name',
				text : '名称'
			}, {
				xtype : 'gridcolumn',
				align : 'center',
				dataIndex : 'version',
				text : '版本'
			}, {
				xtype : 'gridcolumn',
				align : 'center',
				dataIndex : 'useCount',
				text : '使用人数'
			}, {
				xtype : 'datecolumn',
				align : 'center',
				text : '时间',
				format : 'Y-m-d',
				dataIndex : 'addDate'
			}, {
				xtype : 'templatecolumn',
				tpl : '{role}-{typeGroup}',
				text : '类型'
			}, {
				xtype : 'gridcolumn',
				align : 'center',
				dataIndex : 'description',
				text : '描述',
				flex : 1
			} ],
			listeners : {
				containercontextmenu : {
					fn : me.onGridpanelContainerContextMenu,
					scope : me
				},
				itemcontextmenu : {
					fn : me.onGridpanelItemContextMenu,
					scope : me
				}
			}
		});
		me.store.load();
		me.callParent(arguments);
	},
	getApplicationStore : function() {
		return Ext.create('Wdesktop.app.AppManager.store.ApplicationStore',{
			proxy: {
                type: 'ajax',
                url: 'app/listHotApp.json',
                reader: {
                    type: 'json',
                    root: 'apps'
                }
            }
		});
	},
	createContextMenu : function() {
		var me = this;
		return Ext.create('Ext.menu.Menu', {
			width : 100,
			items : [ {
				text : '安装应用',
				iconCls : 'media_collect',
				handler:me.onInstallButtonClick
			} ]
		});
	},
	onGridpanelContainerContextMenu : function(dataview, e, eOpts) {
		e.stopEvent();
	},

	onGridpanelItemContextMenu : function(dataview, record, item, index, e,
			eOpts) {
		var me = this;
		e.stopEvent();
		me.contextMenu.showAt(e.getXY());
	},
	onInstallButtonClick:function(){
		var gridPanel = Ext.ComponentQuery.query('hotRankApplication')[0];
		var apps = gridPanel.getSelectionModel().getSelection();
		
		if(apps.length <=0){
			Ext.MessageBox.alert('警告','请选择需要安装的应用.',null,this);
			return;
		}
		
		if(apps.length >1){
			Ext.MessageBox.alert('警告','同时只能安装一个应用.',null,this);
			return;
		}
		
		Ext.create('Wdesktop.app.AppManager.view.InstallPanel',{
			appId:apps[0].data.id,
			appName:apps[0].data.name,
			userId:apps[0].data.userId,
			appVersion:apps[0].data.version,
			appDescription:apps[0].data.description,
			app:apps[0].data
		}).show();
	}

});
