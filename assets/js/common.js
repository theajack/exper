J.ready(function(){
    // J.id('pdfButton').clk(function(){
    //     var pdf = new jsPDF('p','pt','a4');
    //     pdf.internal.scaleFactor = 1;
    //     var options = {
    //       pagesplit: true
    //     };
    //     pdf.addHTML(J.id('paper'),options,function() {
    //         pdf.save(J.id('pdfButton').attr('name')+'.pdf');
    //     });
    // });

    var child=J.id('date').child();
    var d=new Date();
    child[1].txt(d.getFullYear());
    child[3].txt(d.getMonth()+1);
    child[5].txt(d.getDate());
    J.id('pdfButton').onclick = function() {
        J.cls('draw-tools').addClass('hide');
        html2canvas(J.id('paper'), {
            onrendered:function(canvas) {

                var contentWidth = canvas.width;
                var contentHeight = canvas.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 595.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //pdf页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 555.28;
                var imgHeight = 555.28/contentWidth * contentHeight;

                var pageData = canvas.toDataURL('image/jpeg', 1.0);

                var pdf = new jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }

                pdf.save(J.id('pdfButton').attr('name')+'.pdf');
                J.cls('draw-tools').removeClass('hide');
            }
        });
    }
});