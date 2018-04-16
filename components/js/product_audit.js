var product_audit = {
    init: function () {
        // display
        product_audit.funcs.renderTable()

        var out = $('#product_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面*/
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var products = result.data.content
                const $tbody = $("#product_table").children('tbody')
                product_audit.funcs.renderHandler($tbody, products)
                product_audit.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_audit_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            var status = $('#status').val()
                            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var products = result.data.content //获取数据
                                const $tbody = $("#product_table").children('tbody')
                                product_audit.funcs.renderHandler($tbody, products)
                                product_audit.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            /** 追加状态下拉框事件 */
            var statusSelect = $('#model-li-hide-select-20')
            product_audit.funcs.bindSelectEventListener(statusSelect)
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-20')
            product_audit.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-20')
            product_audit.funcs.bindSearchEventListener(searchBtn)
        },

        /** 渲染 */
        renderHandler: function ($tbody, products) {
            $tbody.empty()
            products.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr>" +
                    "<td>" + product_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + product_audit.funcs.getAuditor(e.auditor) + "</td>" +
                    "<td>" + product_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.judge.name + "</td>" +
                    "<td>" + e.number + "</td>" +
                    "<td>" + e.p1 + "</td>" +
                    "<td>" + e.p2 + "</td>" +
                    "<td>" + e.p3 + "</td>" +
                    "<td>" + e.p4 + "</td>" +
                    "<td>" + e.p7 + "</td>" +
                    "<td>" + e.p10 + "</td>" +
                    "<td>" + e.p13 + "</td>" +
                    "<td>" + e.p19 + "</td>" +
                    "<td>" + e.p20 + "</td>" +
                    "<td>" + e.p21 + "</td>" +
                    "<td>" + e.p22 + "</td>" +
                    "<td>" + e.p23 + "</td>" +
                    "<td>" + e.p24 + "</td>" +
                    "<td>" + e.p25 + "</td>" +
                    "<td>" + e.p34 + "</td>" +
                    "<td>" + e.p35 + "</td>" +
                    "<td>" + e.p36 + "</td>" +
                    "</tr>"
                )
            })
            var auditBtns = $('.audit')
            var detailBtns = $('.detail')
            product_audit.funcs.bindAuditEventListener(auditBtns)
            product_audit.funcs.bindDetailEventListener(detailBtns)
        },

        /** 刷新事件 */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    product_audit.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var product_batch_number = $('#product_batch_number_input').val()
                var status = $('#status').val()
                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                    batchNumber: product_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var products = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $("#product_table").children('tbody')
                    product_audit.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: 'product_audit_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                                    batchNumber: product_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var products = result.data.content //获取数据
                                    const $tbody = $("#product_table").children('tbody')
                                    product_audit.funcs.renderHandler($tbody, products)
                                    product_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

        /** 监听状态下拉选框 */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.change(function () {
                product_audit.funcs.renderTable()
            })
        },

        /** 审核按钮事件 */
        bindAuditEventListener: function (auditBtns) {
            auditBtns.off('click')
            auditBtns.on('click', function () {
                var _selfBtn = $(this)
                var productCode = _selfBtn.attr('id').substr(6)
                console.log("审核" + productCode)
                $.post(home.urls.product.getByCode(), {code: productCode}, function (result) {
                    var product = result.data
                    layer.open({
                        type: 1,
                        content: product_audit.funcs.getData(product),
                        area: ['500px', '700px'],
                        btn: ['确认', '取消'],
                        offset: ['10%', '40%'],
                        yes: function (index) {

                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                })
            })
        },

        /** 查看按钮事件 */
        bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var _selfBtn = $(this)
                var productCode = _selfBtn.attr('id').substr(6)
                console.log("查看" + productCode)
                $.post(home.urls.product.getByCode(), {code: productCode}, function (result) {
                    var product = result.data
                    layer.open({
                        type: 1,
                        content: product_audit.funcs.getData(product),
                        area: ['500px', '700px'],
                        btn: [],
                        offset: ['10%', '40%'],
                    })
                })
            })
        },

        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getAuditor: function (e) {
            if (e == null) {
                return "无";
            }
            else {
                return e.name;
            }
        },

        /** 操作图标 */
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#x1005";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a";
            }
        },

        /** 获得数据（查看数据时） */
        getData: function (product) {
            return (
            "<div id='auditModal'>" +
            "<div>" +
            "<table id='audit_table_inner' class='table_inner' align='center'>" +
            "<thead>" +
            "<tr><td colspan='2'>批号</td><td>检测日期</td><td>数量(t)</td><td>判定</td></tr>" +
            "</thead>" +
            "<tbody>" +
            "<tr><td colspan='2'>" + product.batchNumber + "</td><td>" + product_audit.funcs.formatDate(product.testDate) + "</td><td>" + product.number + "</td><td>" + product.judge.name + "</td></tr>" +
            "</tbody>" +
            "<thead>" +
            "<tr><td colspan='2'>审核状态</td><td>审核人</td><td></td><td></td></tr>" +
            "</thead>" +
            "<tr><td colspan='2'>" + product.status.name + "</td><td>" + product_audit.funcs.getAuditor(product.auditor) + "</td><td></td><td></td></tr>" +
            "<thead>" +
            "<tr><td colspan='2'>检测项目</td><td>三级控制标准</td><td>2016-3-2三级控制标准</td><td>" + product.batchNumber + "</td></tr>" +
            "</thead>" +
            "<tbody>" +
            "<tr><td colspan='2'>振实密度(g/cm3)</td><td>&ge;2.0</td><td>2.3~2.7</td><td>" + product.p1 + "</td></tr>" +
            "<tr><td colspan='2'>水分(ppm)</td><td>&le;500</td><td>&le;200/td><td>" + product.p2 + "</td></tr>" +
            "<tr><td colspan='2'>SSA(m2/g)</td><td>0.20~0.40</td><td>0.22~0.48</td><td>" + product.p3 + "</td></tr>" +
            "<tr><td colspan='2'>pH值</td><td>&le;11.80</td><td>&le;11.80</td><td>" + product.p4 + "</td></tr>" +
            "<tr><td colspan='2'>Li2CO3(%)</td><td></td><td>&le;0.25</td><td>" + product.p5 + "</td></tr>" +
            "<tr><td colspan='2'>LiOH(%)</td><td></td><td>&le;0.20</td><td>" + product.p6 + "</td></tr>" +
            "<tr><td colspan='2'>总Li含量</td><td>&le;100</td><td>&le;120</td><td>" + product.p7 + "</td></tr>" +
            "<tr><td rowspan='6'>粒度(&mu;m)</td><td>D1</td><td>&ge;3.00</td><td></td><td>" + product.p8 + "</td></tr>" +
            "<tr><td>D10</td><td>&ge;6.00</td><td>&ge;5.00</td><td>" + product.p9 + "</td></tr>" +
            "<tr><td>D50</td><td>11.00~14.00</td><td>11.30~13.3</td><td>" + product.p10 + "</td></tr>" +
            "<tr><td>D90</td><td>&le;30.00</td><td>&le;30.00</td><td>" + product.p11 + "</td></tr>" +
            "<tr><td>D99</td><td></td><td>&le;40.00</td><td>" + product.p12 + "</td></tr>" +
            "<tr><td>粒度宽度系数</td><td></td><td></td><td>" + product.p13 + "</td></tr>" +
            "<tr><td rowspan='5'>磁性物质检测(ppb)</td><td>Fe</td><td></td><td></td><td>" + product.p14 + "</td></tr>" +
            "<tr><td>Ni</td><td></td><td></td><td>" + product.p15 + "</td></tr>" +
            "<tr><td>Cr</td><td></td><td></td><td>" + product.p16 + "</td></tr>" +
            "<tr><td>Zn</td><td></td><td></td><td>" + product.p17 + "</td></tr>" +
            "<tr><td>总量</td><td>&le;50</td><td>&le;50</td><td>" + product.p18 + "</td></tr>" +
            "<tr><td colspan='2'>Co(mol%)</td><td></td><td>19.7&plusmn;0.5</td><td>" + product.p19 + "</td></tr>" +
            "<tr><td colspan='2'>Mn(mol%)</td><td></td><td>19.9&plusmn;0.5</td><td>" + product.p20 + "</td></tr>" +
            "<tr><td colspan='2'>Ni(mol%)</td><td></td><td>60.4&plusmn;0.5</td><td>" + product.p21 + "</td></tr>" +
            "<tr><td colspan='2'>Li(%)</td><td>7.0&plusmn;0.5</td><td>7.0&plusmn;0.5</td><td>" + product.p22 + "</td></tr>" +
            "<tr><td colspan='2'>Co(%)</td><td>12.20&plusmn;1.0</td><td>12.20&plusmn;1.0</td><td>" + product.p23 + "</td></tr>" +
            "<tr><td colspan='2'>Mn(%)</td><td>11.4&plusmn;1.0</td><td>11.4&plusmn;1.0</td><td>" + product.p24 + "</td></tr>" +
            "<tr><td colspan='2'>Ni(%)</td><td>36.2&plusmn;1.0</td><td>36.2&plusmn;1.0</td><td>" + product.p25 + "</td></tr>" +
            "<tr><td colspan='2'>Na(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p26 + "</td></tr>" +
            "<tr><td colspan='2'>Mg(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p27 + "</td></tr>" +
            "<tr><td colspan='2'>Ca(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p28 + "</td></tr>" +
            "<tr><td colspan='2'>Fe(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + product.p29 + "</td></tr>" +
            "<tr><td colspan='2'>Cu(ppm)</td><td>&le;50</td><td>&le;20</td><td>" + product.p30 + "</td></tr>" +
            "<tr><td colspan='2'>Zn(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + product.p31 + "</td></tr>" +
            "<tr><td colspan='2'>S(ppm)</td><td></td><td>&le;1500</td><td>" + product.p32 + "</td></tr>" +
            "<tr><td colspan='2'>Al(ppm)</td><td>1000&plusmn;300</td><td>1000&plusmn;300</td><td>" + product.p33 + "</td></tr>" +
            "<tr><td colspan='2'>0.1C放电容量(mAh/g)</td><td></td><td>&ge;177.5</td><td>" + product.p34 + "</td></tr>" +
            "<tr><td colspan='2'>0.1C首次放电效率(%)</td><td></td><td>&ge;88.0</td><td>" + product.p35 + "</td></tr>" +
            "<tr><td colspan='2'>1C放电容量(mAh/g)</td><td></td><td>&ge;162</td><td>" + product.p36 + "</td></tr>" +
            "<tr><td colspan='2'>主原料</td><td></td><td></td><td>" + product.p37 + "</td></tr>" +
            "<tr><td colspan='2'>成品外观、重量抽查结果</td><td></td><td></td><td>" + product.p38 + "</td></tr>" +
            "<tr><td colspan='2'>产线</td><td></td><td></td><td>" + product.p39 + "</td></tr>" +
            "</tbody>" +
            "</table>" +
            "</div>" +
            "</div>");
        }
    }
}