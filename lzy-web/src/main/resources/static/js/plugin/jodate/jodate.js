+(function($)
{
    "use strict";

    // PUBLIC CLASS DEFINITION
    // ================================

    var JoDate = function (element, options)
    {
        this.element       = element;
        this.$element      = $(element);
        this.options       = $.extend({}, JoDate.DEFAULTS, options);
    };

    JoDate.VERSION  = '1.0.0';

    JoDate.DEFAULTS =
    {
        startYear:2010,
        endYear:2020,
        startMonth:1,
        endMonth:12
    };

    JoDate.prototype.init = function ()
    {
        var that = this;
        var $element = this.$element;
        var element = this.element;

        $element.wrap('<span class="jo-date-wrap" />');

        var $jodate= $('<div class="jo-date" />');

        var offsetHeight=element.offsetHeight || 0;
        var offsetTop = element.offsetTop || 0;
        var offsetLeft = element.offsetLeft || 0;
        var offsetWidth = element.offsetWidth || "120";

        $jodate.css({
            position: 'absolute',
            "z-index": '5',
            "color": '#666',
            width:offsetWidth,
            top:offsetHeight+offsetTop+27,
            left:offsetLeft
        });

        var $jolist = $('<ul class="jo-date-list" />');

        var show = $element.data('show');

        if(show=="year")
        {
            var startYear = parseInt($element.data("startyear") || JoDate.DEFAULTS.startYear);
            var endYear = parseInt($element.data("endyear") || JoDate.DEFAULTS.endYear);

            var nowYear = new Date().getFullYear();

            for(var i=startYear; i<=endYear; i++)
            {
                var $li = $('<li data-value='+ i +'>'+i+'</li>');
                if(i>nowYear)
                {
                    $li.addClass('disabled');
                }
                $li.appendTo($jolist);
            }

        }
        else if(show=="month")
        {
            var startMonth = parseInt($element.data("startmonth") || JoDate.DEFAULTS.startMonth);
            var endMonth = parseInt($element.data("endmonth") || JoDate.DEFAULTS.endMonth);

            for(var i=startMonth; i<=endMonth; i++)
            {
                var j = i;
                if(j<10)
                {
                    j = 0+''+i;
                }
                var $li = $('<li data-value='+ j +'>'+i+'月</li>');
                $li.appendTo($jolist);
            }
        }
        $jolist.appendTo($jodate);
        $element.after($jodate);

    };


    // PLUGIN DEFINITION
    // ==========================

    function Plugin(option)
    {
        var args     = arguments;

        return this.each(function ()
        {
            var $this   = $(this);
            var data    = $this.data('jodate.class');
            var options = $.extend({}, JoDate.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('jodate.class', (data = new JoDate(this, options)));

            if (typeof option == 'string' && $.isFunction(data[option]))
            {
                [].shift.apply(args);
                if (!args) data[option]();
                else data[option].apply(data, args);
            }

        });
    }

    var old = $.fn.jodate;

    $.fn.jodate             = Plugin;
    $.fn.jodate.Constructor = JoDate;


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.jodate.noConflict = function ()
    {
        $.fn.jodate = old;
        return this;
    };

    // DATA-API
    // ==============

    $(document).on('ready', function(e) {
        var $this = $('[data-toggle="jodate"]');

        if (!$this.length) return;

        Plugin.call($this, 'init');
    });

    /*开启*/
    $(document).on('click.open', '[data-toggle="jodate"]', function(e) {

        var $this = $(this);
        $('.jo-date-wrap').removeClass('open');
        $('.jo-date').removeClass('open').hide();

        var $jodatewrap = $this.closest('.jo-date-wrap');

        if (!$jodatewrap.length) return;

        $jodatewrap.addClass('open');
        $jodatewrap.find('.jo-date').addClass('open').show();

        e.preventDefault();
    });

    /*关闭*/
    $(document).on('click.close', function(e) {

        var $target = $(e.target);

        if($target.parents().is('.jo-date-wrap'))
            return;

        var $jodatewrap = $(document).find('.jo-date-wrap');

        if (!$jodatewrap.length) return;

        $jodatewrap.removeClass('open');
        $jodatewrap.find('.jo-date').removeClass('open').hide();

        e.preventDefault();
    });

    /*选择*/
    $(document).on('click.select', '.jo-date-list > li', function(e) {
        var $li = $(this);

        if($li.is('.disabled'))
        {
            return;
        }

        var $jodatewrap =  $li.closest('.jo-date-wrap');

        var $input =$jodatewrap.find('[data-toggle="jodate"]');
        var $jodate = $jodatewrap.find('.jo-date');

        var value = $li.data('value');
        $input.val(value);

        $li.addClass('selected').siblings('li').removeClass('selected');
        $jodatewrap.removeClass('open');
        $jodate.removeClass('open').hide();

        e.preventDefault();
    });

})(jQuery);