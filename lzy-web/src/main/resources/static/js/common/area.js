/**
 * Created by LLP on 2017/9/28.
 */
define(['jquery'], function ($) {
    var area = {
        province : '',
        city : '',
        country : '',
        dealAreaId:function () {
            var rootAreaId = $('#rootAreaId').val();
            if (rootAreaId.length == 2) { //省
                $('#selProvince').hide();
                area.dealAreaData(rootAreaId, "#selCity");
            } else if (rootAreaId.length == 4) { //市
                $('#selProvince').hide();
                $('#selCity').hide();
                area.dealAreaData(rootAreaId, "#selectCountry");
            } else if (rootAreaId.length == 6) { //区
                $('#selProvince').hide();
                $('#selCity').hide();
                var cityId = rootAreaId.substring(0,4);
                area.dealAreaData(cityId, "#selectCountry");
                $('#selectCountry').attr('disabled','disabled');
                area.country = rootAreaId;
                area.selectAreaId();
            }

        },

        dealAreaData: function(parentCode, dom) {

            $.ajax({
                url: '${base}/area!queryListbyParentCode.ajax',
                data: {
                    "parentCode": parentCode
                },
                dataType: "json",
                success: function(resultData) {

                    var areaVoList = resultData.data.areaVoList;
                    var len = areaVoList.length;
                    $(dom).html('');

                    $(dom).append('<option value="">请选择</option>');
                    for (i = 0; i < len; i++) {
                        $(dom).append('<option value=' + areaVoList[i].code + '>' + areaVoList[i].name + '</option>');
                    }
                    //特殊处理，如果配置表配置的是区，直接选中配置的区，且用户不能选择
                    var rootAreaId = $('#rootAreaId').val();
                    if (rootAreaId.length == 6) {
                        $('#selectCountry').val(rootAreaId);
                    }
                }
            });
        },
        selectarea: function() {
            area.dealAreaData("0", "#selProvince");
            $("#selProvince").append('<option>省</option>');
        },
        selectcity: function() {
            $("#selProvince").change(function() {
                area.city = '';
                area.country = '';

                var areaid = $("#selProvince").val();
                area.province = areaid;
                area.selectAreaId();
                area.dealAreaData(areaid, "#selCity");
            });
        },
        listCountry: function() {
            $("#selCity").change(function() {
                area.country = '';

                var areaId = $("#selCity").val();
                area.city = areaId;
                area.selectAreaId();
                area.dealAreaData(areaId, "#selectCountry");
            });
        },
        selectCountry: function() {
            $("#selectCountry").change(function() {
                area.country = $("#selectCountry").val();
                area.selectAreaId();
            });
        },
        selectAreaId: function () {
            var areaId = '';
            if (area.country != '') {
                areaId = area.country;
            } else if (area.city != '') {
                areaId = area.city;
            } else if (area.province != '') {
                areaId = area.province;
            } else {
                areaId = '';
            }
            $('#selectAreaId').val(areaId);
        }
    }

    var areaInit = function () {
        area.selectarea();
        area.selectcity();
        area.listCountry();
        area.selectCountry();
        area.dealAreaId();
    }

    return {
        init: areaInit
    };
});