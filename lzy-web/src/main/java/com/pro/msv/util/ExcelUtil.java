package com.pro.msv.util;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;

@SuppressWarnings("all")
public class ExcelUtil {
	
	private static final String SPLIT = ",";
	
	private static Processer processer = new Processer();
	
	private static DecimalFormat decimalFormat = new DecimalFormat("0.00");
	
	private ExcelUtil() {
		
	}
	
	public static Row genRow() {
		return new Row();
	}
	
	public static List<Row> genRows() {
		return new ArrayList<>();
	}
	
	public static Sheet genSheet(String sheetName) {
		return new Sheet(sheetName);
	}
	
	public static String fenToYuan(String money) {
		return decimalFormat.format(new BigDecimal(money).divide(new BigDecimal("100")));
	}
	
	public static String fenToYuan(Float money) {
		return decimalFormat.format(new BigDecimal(money).divide(new BigDecimal("100")));
	}
	
	public static String fenToYuan(Double money) {
		return decimalFormat.format(new BigDecimal(money).divide(new BigDecimal("100")));
	}
	
	public static String fenToYuan(BigDecimal money) {
		return decimalFormat.format(money.divide(new BigDecimal("100")));
	}
	
	public static String fenToYuan(Object money) {
		return decimalFormat.format(new BigDecimal(money.toString()).divide(new BigDecimal("100")));
	}
	
	public static void exportExcel(Sheet sheet, String fullPath) {
		List<Sheet> sheets = new ArrayList<>();
		sheets.add(sheet);
		exportExcel(sheets, fullPath);
	}
	
	public static void exportExcel(Sheet sheet, String path, String fileName) {
		List<Sheet> sheets = new ArrayList<>();
		sheets.add(sheet);
		exportExcel(sheets, path, fileName);
	}
	
	public static void exportExcel(List<Sheet> sheets, String path, String fileName) {
		if(!path.endsWith("/")) {
			path += "/";
		}
		if(fileName.startsWith("/")) {
			fileName = fileName.substring(1);
		}
		exportExcel(sheets, path+fileName);
	}
	
	public static void exportExcel(List<Sheet> sheets, String fullPath) {
		Set<String> sheetNames = new HashSet<>();
		if(sheets != null && sheets.size() > 0) {
			for(Sheet sheet:sheets) {
				if(sheetNames.contains(sheet.getName())) {
					throw new RuntimeException("duplicated sheet name");
				} else {
					sheetNames.add(sheet.getName());
				}
			}
		}
		if(StringUtils.isBlank(fullPath)) {
			throw new RuntimeException("miss filePath");
		}
		if(!fullPath.endsWith(".xls")) {
			fullPath += ".xls";
		}
		processer.export(sheets, fullPath);
	}
	
	/*
	 * 单元格数据类型
	 */
	public enum Data {
		 STRING,
		 FLOAT,
		 INT,
		 LONG,
		 LONGDATE,// 日期格式
		 DATE,// 日期格式
		 NUM,// 保留两位小数
		 COIN,// 货币格式,单位为元,单位为分的金额用fenToYuan()转换
		 PERCENTAGE;// 百分比格式
	}

	/*
	 * 单元格
	 */
	private static class Cell {
		private Data type;
		private Object value;
		
		public Cell(Data type,Object value) {
			this.type = type;
			this.value = value;
		}
		public Data getType() {
			return type;
		}
		public Object getValue() {
			return value;
		}
	}
	
	/*
	 * 单元格(可合并)
	 */
	private static class RichCell {
		
		private String value;
		private int rowStart;
		private int rowEnd;
		private int colStart;
		private int colEnd;
		
		public RichCell(int rowStart, int rowEnd, int colStart, int colEnd, String value) {
			if(rowEnd < rowStart || colEnd < colStart) {
				throw new IllegalArgumentException("rule: rowEnd >= rowStart && colEnd >= colStart");
			}
			this.rowStart = rowStart;
			this.rowEnd = rowEnd;
			this.colStart = colStart;
			this.colEnd = colEnd;
			if(value.indexOf(SPLIT) != -1) {
				this.value = value.replace(SPLIT, "\r\n");
			} else {
				this.value = value;
			}
		}
		public boolean needMerge() {
			if(this.rowEnd > this.rowStart || this.colEnd > this.colStart) {
				return true;
			}
			return false;
		}
		public String getValue() {
			return value;
		}
		public int getRowStart() {
			return rowStart;
		}
		public int getColStart() {
			return colStart;
		}
		public int getRowEnd() {
			return rowEnd;
		}
		public int getColEnd() {
			return colEnd;
		}
	}
	
	/*
	 * 行
	 */
	public static class Row {
		private List<Cell> cells = new ArrayList<>();
		
		private List<RichCell> richCells = new ArrayList<>(); 
		
		public void addCell(String content) {
			this.cells.add(new Cell(Data.STRING, content));
		}
		
		public void addCell(Float content) {
			this.cells.add(new Cell(Data.FLOAT, content));
		}
		
		public void addCell(Integer content) {
			this.cells.add(new Cell(Data.INT, content));
		}
		
		public void addCell(Long content) {
			this.cells.add(new Cell(Data.LONG, content));
		}
		
		public void addCell(Data type, Object content) {
			this.cells.add(new Cell(type, content));
		}
		
		public void addRichCell(int rowStart, int rowEnd, int colStart, int colEnd, String value) {
			this.richCells.add(new RichCell(rowStart, rowEnd, colStart, colEnd, value));
		}
		
		public List<Cell> getCells() {
			return cells;
		}
		public List<RichCell> getRichCells() {
			return richCells;
		}
	}
	
	/*
	 * 表
	 */
	public static class Sheet {
		private String name;//表名
		private List<Row> header = new ArrayList<>();//表头
		private boolean freezeHeader = false;//是否冻结表头
		private float[] columnWidth;//列宽
		private String title;//标题
		private List<Row> data = new ArrayList<>();
		private String[] detail;
		private String[] subTitle;
		private List<String> subTitle1= new ArrayList<>();
		private String[] buttom;
		
		public void addDataRow(Row row) {
			this.data.add(row);
		}
		public int getMaxColNum() {
			int maxHeader = 0;
			int maxData = 0;
			if(!this.header.isEmpty()) {
				for(Row row:this.header) {
					for(RichCell richCell:row.getRichCells()) {
						if(maxHeader < richCell.getColEnd()) {
							maxHeader = richCell.getColEnd();
						}
					}
				}
			}
			if(!this.data.isEmpty()) {
				maxData = this.data.get(0).getCells().size();
			}
			return Math.max(maxHeader, maxData);
		}
		
		public Sheet(String sheetName) {
			this.name = sheetName;
		}
		public String getName() {
			return name;
		}
		public List<Row> getHeader() {
			return header;
		}
		public boolean isFreezeHeader() {
			return freezeHeader;
		}
		public String getTitle() {
			return title;
		}
		public List<Row> getData() {
			return data;
		}
		public void setName(String name) {
			this.name = name;
		}
		public void setHeader(String... header) {
			if(header != null && header.length > 0) {
				this.header = new ArrayList<>();
				Row row = new Row();
				for(String s:header) {
					row.addRichCell(0, 0, 0, 0, s);
				}
				this.header.add(row);
			}
		}
		public void setHeader(List<Row> rows) {
			this.header = rows;
		}
		public void setFreezeHeader(boolean freezeHeader) {
			this.freezeHeader = freezeHeader;
		}
		public void setTitle(String title) {
			this.title = title;
		}
		public void setData(List<Row> data) {
			this.data = data;
		}
		public float[] getColumnWidth() {
			return columnWidth;
		}
		public void setColumnWidth(float... columnWidth) {
			this.columnWidth = columnWidth;
		}
		public String[] getDetail() {
			return detail;
		}
		public String[] getSubTitle() {
			return subTitle;
		}
		public List<String> getSubTitle1() {
			return subTitle1;
		}
		public String[] getButtom() {
			return buttom;
		}
		public void setDetail(String... detail) {
			this.detail = detail;
		}
		public void setSubTitle(String... subTitle) {
			this.subTitle = subTitle;
		}
		public void setSubTitle1(String... subTitle1) {
			if(subTitle1 != null && subTitle1.length > 0) {
				for(String s:subTitle1) {
					if(s.indexOf(SPLIT) != -1) {
						this.subTitle1.add(s.replace(SPLIT, "\r\n"));
					} else {
						this.subTitle1.add(s);
					}
				}
			}
		}
		public void setButtom(String... buttom) {
			this.buttom = buttom;
		}
	}
	
	private static class Processer{
		
		private static final int COLUMNWIDTH = 512;// 每字符列宽
		private static final int COLUMNLENGTH = 20;// 默认列宽
		private static final short ROWHIGHT = 600;// 默认行高
		private HSSFDataFormat dataFormat;
		
		public void export(List<Sheet> sheets, String fullPath) {
			HSSFWorkbook workbook = new HSSFWorkbook();
			for(Sheet sheet:sheets) {
				writeData(workbook, sheet);
			}
			try {
				File path = new File(new File(fullPath).getParent());
				if(!path.exists()) {
					path.mkdirs();
				}
				FileOutputStream out = new FileOutputStream(fullPath);
				workbook.write(out);
				workbook.close();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		private void writeData(HSSFWorkbook workbook,Sheet sheet) {
			if(StringUtils.isBlank(sheet.getName())) {
				throw new RuntimeException("miss sheetName");
			}
			int rowNum = 0;
			int freezeNum = 0;
			dataFormat = workbook.createDataFormat();
			HSSFSheet hssfSheet = workbook.createSheet(sheet.getName());
			HSSFRow hssfRow;
			HSSFCell hssfCell;
			//标题
			if(StringUtils.isNotBlank(sheet.getTitle())) {
				hssfRow = genRow(hssfSheet, rowNum, null);
				// 合并单元格
				hssfCell = genCell(hssfRow, 0);
				if(sheet.getMaxColNum() != 0) {
					for(int c=0;c<sheet.getMaxColNum();c++) {
						HSSFCell hssfCell1 = genCell(hssfRow, c);
						hssfCell1.setCellStyle(genHeaderCellStyle(workbook));
					}					
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, sheet.getMaxColNum() - 1));
				} else {
					hssfCell.setCellStyle(genHeaderCellStyle(workbook));
				}
				hssfCell.setCellValue(sheet.getTitle());
				rowNum++;
				freezeNum++;
			}
			// 详情
			if (sheet.getDetail() != null) {
				hssfRow = genRow(hssfSheet, rowNum, (short) (315 * (sheet.getDetail().length + 1)));
				String[] detail = sheet.getDetail();
				StringBuffer stringBuffer = new StringBuffer();
				for (short i = 0; i < detail.length; i++) {
					if (i != detail.length - 1) {
						stringBuffer.append(detail[i] + "\r\n");
					} else {
						stringBuffer.append(detail[i]);
					}
				}
				hssfCell = genCell(hssfRow, 0);
				if(sheet.getMaxColNum() != 0) {
					for(int c=0;c<sheet.getMaxColNum();c++) {
						HSSFCell hssfCell1 = genCell(hssfRow, c);
						hssfCell1.setCellStyle(genDetailCellStyle(workbook));
					}					
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, sheet.getMaxColNum() - 1));
				} else {
					hssfCell.setCellStyle(genDetailCellStyle(workbook));
				}
				hssfCell.setCellValue(stringBuffer.toString());
				rowNum++;
				freezeNum++;
			}
			// 副标题
			if (sheet.getSubTitle() != null) {
				hssfRow = genRow(hssfSheet, rowNum, (short) (315 * (sheet.getSubTitle().length + 1)));
				String[] detail = sheet.getSubTitle();
				StringBuffer stringBuffer = new StringBuffer();
				for (short i = 0; i < detail.length; i++) {
					if (i != detail.length - 1) {
						stringBuffer.append(detail[i] + "\r\n");
					} else {
						stringBuffer.append(detail[i]);
					}
				}
				hssfCell = genCell(hssfRow, 0);
				if(sheet.getMaxColNum() != 0) {
					for(int c=0;c<sheet.getMaxColNum();c++) {
						HSSFCell hssfCell1 = genCell(hssfRow, c);
						hssfCell1.setCellStyle(genDetailCellStyle(workbook));
					}					
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, sheet.getMaxColNum() - 1));
				} else {
					hssfCell.setCellStyle(genDetailCellStyle(workbook));
				}
				hssfCell.setCellValue(stringBuffer.toString());
				rowNum++;
				freezeNum++;
			}
			// 副标题1
			if (sheet.getSubTitle1() != null && sheet.getSubTitle1().size() >= 2) {
				hssfRow = genRow(hssfSheet, rowNum, (short) (315 * (sheet.getSubTitle1().size() + 1)));
				List<String> details = sheet.getSubTitle1();
				int mergeCol = sheet.getMaxColNum() - sheet.getSubTitle1().size();
				hssfCell = genCell(hssfRow, 0);
				if(sheet.getMaxColNum() != 0) {
					for(int c=0;c<sheet.getMaxColNum();c++) {
						HSSFCell hssfCell1 = genCell(hssfRow, c);
						hssfCell1.setCellStyle(genDetailCellStyle(workbook));
					}					
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, mergeCol));
				} else {
					hssfCell.setCellStyle(genDetailCellStyle(workbook));
				}
				hssfCell.setCellValue(sheet.getSubTitle1().get(0));
				for(int i=1;i<sheet.getSubTitle1().size();i++) {
					hssfCell = genCell(hssfRow, mergeCol + i);
					hssfCell.setCellStyle(genHeaderCellStyle(workbook));
					hssfCell.setCellValue(sheet.getSubTitle1().get(i));
				}
				rowNum++;
				freezeNum++;
			}
			// 表头
			if(!sheet.getHeader().isEmpty()) {
				int maxRowspan = 0;
				int rowNumTemp = rowNum;
				for(Row row:sheet.getHeader()) {
					hssfRow = genRow(hssfSheet, rowNumTemp, null);
					for(int i=0;i<row.getRichCells().size();i++) {
						RichCell richCell = row.getRichCells().get(i);
						if(richCell.needMerge()) {
							for(int r=richCell.getRowStart();r<=richCell.getRowEnd();r++) {
								hssfRow = hssfSheet.getRow(rowNum + r) == null?hssfSheet.createRow(rowNum + r):hssfSheet.getRow(rowNum + r);
								for(int c=richCell.getColStart();c<=richCell.getColEnd();c++) {
									hssfCell = genCell(hssfRow, c);
									hssfCell.setCellStyle(genHeaderCellStyle(workbook));
								}
							}
							hssfSheet.addMergedRegion(new CellRangeAddress(rowNum + richCell.getRowStart(), rowNum + richCell.getRowEnd(),
									richCell.getColStart(), richCell.getColEnd()));
							if(richCell.getRowEnd() - richCell.getRowStart() > maxRowspan) {
								maxRowspan = richCell.getRowEnd() - richCell.getRowStart();
							}
							hssfCell = hssfSheet.getRow(rowNumTemp).getCell(richCell.getColStart());
						} else if(richCell.getColStart() > 0){
							hssfCell = genCell(hssfSheet.getRow(rowNumTemp), richCell.getColStart());
							hssfCell.setCellStyle(genHeaderCellStyle(workbook));
						} else {
							hssfCell = genCell(hssfRow, i);
							hssfCell.setCellStyle(genHeaderCellStyle(workbook));
						}
						hssfCell.setCellValue(richCell.getValue());
					}
					rowNumTemp++;
				}
				if(maxRowspan > 0) {
					freezeNum += rowNumTemp - rowNum;
					rowNum += rowNumTemp - rowNum;
				} else {
					rowNum += sheet.getHeader().size();
					freezeNum += sheet.getHeader().size();
				}
			}
			//冻结表头
			if(sheet.isFreezeHeader() && freezeNum > 0) {
				hssfSheet.createFreezePane(0, freezeNum);
			}
			// 数据行
			List<Row> data = sheet.getData();
			// 设置列宽 (每列宽度均可自行设置,否则根据每列最长字数计算得出)
			/*if (sheet.getColumnWidth() != null) {
				float[] columnWidth = sheet.getColumnWidth();
				for (int i = 0; i < columnWidth.length; i++) {
					hssfSheet.setColumnWidth(i, (int) (256 * columnWidth[i] + 184));// 256*width+184:excel列宽转poi参数
				}
			} else {
				rows.addAll(data);
				setColumnsLength(rows, hssfSheet);
			}*/
			if (data != null && !data.isEmpty()) {
				HSSFCellStyle[] cellStyles = new HSSFCellStyle[data.get(0).getCells().size()];
				for(Row row:data) {
					hssfRow = genRow(hssfSheet, rowNum, null);
					for (int j = 0; j < row.getCells().size(); j++) {
						hssfCell = genCell(hssfRow, j);
						if (cellStyles[j] == null) {
							cellStyles[j] = genTextCellStyle(workbook);
						}
						hssfCell.setCellStyle(cellStyles[j]);
						setCellValue(hssfCell, row.getCells().get(j));
					}
					rowNum++;
				}
				rowNum++;
			} else {
				hssfRow = genRow(hssfSheet, rowNum, null);
				hssfCell = genCell(hssfRow, 0);
				hssfCell.setCellValue("暂无数据");
				if(sheet.getMaxColNum() != 0) {
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, sheet.getMaxColNum() - 1));
				}
				rowNum++;
			}
			if(sheet.getButtom() != null) {
				if(!data.isEmpty()) {
					rowNum--;
				}
				hssfRow = genRow(hssfSheet, rowNum, (short) (315 * (sheet.getButtom().length + 1)));
				String[] detail = sheet.getButtom();
				StringBuffer stringBuffer = new StringBuffer();
				for (short i = 0; i < detail.length; i++) {
					if (i != detail.length - 1) {
						stringBuffer.append(detail[i] + "\r\n");
					} else {
						stringBuffer.append(detail[i]);
					}
				}
				hssfCell = genCell(hssfRow, 0);
				if(sheet.getMaxColNum() != 0) {
					for(int c=0;c<sheet.getMaxColNum();c++) {
						HSSFCell hssfCell1 = genCell(hssfRow, c);
						hssfCell1.setCellStyle(genTextCellStyle1(workbook));
					}					
					hssfSheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, sheet.getMaxColNum() - 1));
				} else {
					hssfCell.setCellStyle(genTextCellStyle1(workbook));
				}
				hssfCell.setCellValue(stringBuffer.toString());
				rowNum++;
			}
			//调整列宽
			if (sheet.getColumnWidth() != null) {
				float[] columnWidth = sheet.getColumnWidth();
				for (int i = 0; i < columnWidth.length; i++) {
					hssfSheet.setColumnWidth(i, (int) (256 * columnWidth[i] + 184));
				}
			} else {
				for(int i=0;i<sheet.getMaxColNum();i++) {
					hssfSheet.autoSizeColumn(i, true);
				}
			}
		}
		
		private static HSSFRow genRow(HSSFSheet hssfSheet, int rowNum, Short rowHight) {
			HSSFRow hssfRow = hssfSheet.getRow(rowNum) == null?hssfSheet.createRow(rowNum):hssfSheet.getRow(rowNum);
			if(rowHight == null) {
				hssfRow.setHeight(ROWHIGHT);
			} else {
				hssfRow.setHeight(rowHight);
			}
			return hssfRow;
		}
		
		private static HSSFCell genCell(HSSFRow hssfRow,int colNum) {
			return hssfRow.getCell(colNum)== null?hssfRow.createCell(colNum):hssfRow.getCell(colNum);
		}
		
		// 设置每列宽度(根据每列最长字数)
		private static void setColumnsLength(List<Row> list, HSSFSheet hssfSheet) {
			if (list != null && list.size() > 0) {
				int[] columnLengthArr = new int[list.get(0).getCells().size()];
				for (Row row : list) {
					for(int i=0;i<row.getCells().size();i++) {
						Cell cell = row.getCells().get(i);
						if (cell.getValue() != null) {
							int length = cell.getValue().toString().length();
							if (Data.DATE.equals(cell.getType())) {
								columnLengthArr[i] = 6;
								continue;
							}
							if (Data.LONGDATE.equals(cell.getType())) {
								columnLengthArr[i] = 12;
								continue;
							}
							if (length > COLUMNLENGTH) {
								columnLengthArr[i] = COLUMNLENGTH;
							} else {
								if (length > columnLengthArr[i]) {
									columnLengthArr[i] = length;
								}
							}
						}
					}
				}
				for (int i = 0; i < columnLengthArr.length; i++) {
					hssfSheet.setColumnWidth(i, (columnLengthArr[i] + 1) * COLUMNWIDTH);
				}
			} else {
				hssfSheet.setDefaultColumnWidth((short) COLUMNLENGTH);
			}
		}
		
		// 单元格赋值
		private void setCellValue(HSSFCell hssfCell, Cell cell) {
			Data key = cell.getType();
			Object value = cell.getValue();
			if (key.equals(Data.INT)) {
				if (value != null) {
					hssfCell.setCellValue((int) value);
				} else {
					hssfCell.setCellValue(0);
				}
			} else if (key.equals(Data.FLOAT)) {
				if (value != null) {
					hssfCell.setCellValue((Float) value);
				} else {
					hssfCell.setCellValue(0F);
				}
			} else if (key.equals(Data.STRING)) {
				if (value != null) {
					hssfCell.setCellValue(value.toString());
				}
			} else if (key.equals(Data.LONG)) {
				if (value != null) {
					hssfCell.setCellValue((Long) value);
				} else {
					hssfCell.setCellValue(0L);
				}
			} else if (key.equals(Data.LONGDATE)) {
				if (value != null) {
					hssfCell.getCellStyle().setDataFormat(dataFormat.getFormat("yyyy/m/d h:mm;@"));
					hssfCell.setCellValue((Date) value);
				}
			} else if (key.equals(Data.DATE)) {
				if (value != null) {
					hssfCell.getCellStyle().setDataFormat(dataFormat.getFormat("yyyy/m/d;@"));
					hssfCell.setCellValue((Date) value);
				}
			} else if (key.equals(Data.NUM)) {
				hssfCell.getCellStyle().setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00"));
				if (value != null) {
					hssfCell.setCellValue((Float) value);
				} else {
					hssfCell.setCellValue(0.00F);
				}
			} else if (key.equals(Data.COIN)) {
				// ¥#,##0.00;¥-#,##0.00 office
				// ￥#,##0.00;￥-#,##0.00 wps
				hssfCell.getCellStyle().setDataFormat(dataFormat.getFormat("¥#,##0.00;¥-#,##0.00"));
				if (value != null) {
					try {
						hssfCell.setCellValue(decimalFormat.parse(value.toString()).doubleValue());
					} catch (ParseException e) {
						e.printStackTrace();
					}
				} else {
					hssfCell.setCellValue(0D);
				}
			} else if (key.equals(Data.PERCENTAGE)) {
				hssfCell.getCellStyle().setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));
				if (value != null) {
					hssfCell.setCellValue((Float) value);
				} else {
					hssfCell.setCellValue(0F);
				}
			} else {
				if (value != null) {
					hssfCell.setCellValue(value.toString());
				}
			}
		}
	
		// 合并单元格样式
		private static HSSFCellStyle genMergedRegionCellStyle(HSSFWorkbook workbook) {
			HSSFCellStyle titleStyle = workbook.createCellStyle();
			titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平居中
			titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中
			// 背景色
			titleStyle.setFillForegroundColor(HSSFColor.LIGHT_GREEN.index);
			titleStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			titleStyle.setFillBackgroundColor(HSSFColor.LIGHT_GREEN.index);
			titleStyle.setWrapText(true);
			titleStyle.setFont(genTitleFont(workbook, 12));
			return titleStyle;
		}
		
		private static HSSFCellStyle genMergedRegionLeftCellStyle(HSSFWorkbook workbook) {
			HSSFCellStyle titleStyle = workbook.createCellStyle();
			titleStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平居中
			titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中
			// 背景色
			titleStyle.setFillForegroundColor(HSSFColor.LIGHT_GREEN.index);
			titleStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			titleStyle.setFillBackgroundColor(HSSFColor.LIGHT_GREEN.index);
			titleStyle.setWrapText(true);
			titleStyle.setFont(genTitleFont(workbook, 12));
			return titleStyle;
		}
	
		// 标题字体
		private static HSSFFont genTitleFont(HSSFWorkbook workbook, int fontSize) {
			HSSFFont font = workbook.createFont();
			font.setColor(HSSFColor.VIOLET.index);
			font.setFontHeightInPoints((short) fontSize);
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			return font;
		}
	
		// 详情样式
		private static HSSFCellStyle genDetailCellStyle(HSSFWorkbook workbook) {
			HSSFCellStyle style = workbook.createCellStyle();
			style.setFillForegroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setFillBackgroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			style.setBorderRight(HSSFCellStyle.BORDER_THIN);
			style.setBorderTop(HSSFCellStyle.BORDER_THIN);
			style.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
			style.setWrapText(true);
			style.setFont(genTitleFont(workbook, 12));
			return style;
		}
		
		// 表头样式
		private static HSSFCellStyle genHeaderCellStyle(HSSFWorkbook workbook) {
			HSSFCellStyle style = workbook.createCellStyle();
			style.setFillForegroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setFillBackgroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			style.setBorderRight(HSSFCellStyle.BORDER_THIN);
			style.setBorderTop(HSSFCellStyle.BORDER_THIN);
			style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
			style.setWrapText(true);
			style.setFont(genTitleFont(workbook, 12));
			return style;
		}
	
		// 文本样式
		private static HSSFCellStyle genTextCellStyle(HSSFWorkbook workbook) {
			HSSFCellStyle style = workbook.createCellStyle();
			style.setFillForegroundColor(HSSFColor.WHITE.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setFillBackgroundColor(HSSFColor.WHITE.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			style.setBorderRight(HSSFCellStyle.BORDER_THIN);
			style.setBorderTop(HSSFCellStyle.BORDER_THIN);
			style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
			style.setWrapText(true);
			style.setFont(genTextFont(workbook));
			return style;
		}
		
		// bottom
		private static HSSFCellStyle genTextCellStyle1(HSSFWorkbook workbook) {
			HSSFCellStyle style = workbook.createCellStyle();
			style.setFillForegroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setFillBackgroundColor(HSSFColor.LIGHT_GREEN.index);
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			style.setBorderRight(HSSFCellStyle.BORDER_THIN);
			style.setBorderTop(HSSFCellStyle.BORDER_THIN);
			style.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
			style.setWrapText(true);
			style.setFont(genTextFont(workbook));
			return style;
		}
	
		// 文本字体
		private static HSSFFont genTextFont(HSSFWorkbook workbook) {
			HSSFFont font = workbook.createFont();
			font.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
			return font;
		}
	}
}
