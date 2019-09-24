package com.pro.msv.common.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class BeanUtil {

	public static Map fieldMap = new HashMap();
	
	private static String splitstr = ",";
	
    public static Map<String,String> notAnnotationPresentMap = new HashMap<String,String>();
	
	public static Map<String,String> annotationPresentMap = new HashMap<String,String>();
	
	public static boolean isAnnotationPresent(Class clazz, Class<?>   ssAnnotionClass){
		String key = clazz.getName()+"_"+ssAnnotionClass.getName();
		if (!annotationPresentMap.containsKey(key)  ) {
		       if(notAnnotationPresentMap.containsKey(key) ){
 		    		return false;
		       }else{
		    	   if(  !clazz.isAnnotationPresent(ssAnnotionClass)){
		    		   notAnnotationPresentMap.put(key, "");
 			    		return false;
		    	   }else{
		    		   annotationPresentMap.put(key, "");
		    		   return true;
		    	   }
		       }
		}
		return true;
	}
	
	
	public static <T> Map<String, T> exchangeListToMap(List<T> list,String keyNames){
		if(list == null || list.size() == 0 || StringUtils.isEmpty(keyNames)){
			return new HashMap<String, T>();
		}
		String[] mapKeyNames = new String[1];
		if(keyNames.indexOf(splitstr) ==  -1){
			mapKeyNames[0] = keyNames;
		}else{
			mapKeyNames = keyNames.split(splitstr);
		}
		Map<String,T> resultMap = new HashMap<String, T>();
		for(int i=0;i<list.size();i++){
			T obj = list.get(i);
			String mapKey = "";
			for(int j=0;j<mapKeyNames.length;j++){
				Object propValue = BeanUtil.getPropertyValue(mapKeyNames[j], obj);
				if(propValue == null){
					continue;
				}
				String key = ""+ propValue;
				if(StringUtils.isEmpty(key)){
					continue;
				}
				if(StringUtils.isEmpty(mapKey)){
					mapKey = key;
				}else{
					mapKey = mapKey+"_"+key;
				}
			}
  			 if(!StringUtils.isEmpty(mapKey)){
 				resultMap.put(mapKey, obj);
 			 }
  		}
		return resultMap;
	}
	
	public static <T> Map<String,List<T>> exchangeListToMapList(List<T> list,String keyNames){
		if(list == null || list.size() == 0 || StringUtils.isEmpty(keyNames)){
			return new HashMap<String,List<T>>();
		}
		String[] mapKeyNames = new String[1];
		if(keyNames.indexOf(splitstr) == -1){
			mapKeyNames[0] = keyNames;
		}else{
			mapKeyNames = keyNames.split(splitstr);
		}
		Map<String,List<T>> resultMap = new HashMap<String,List<T>>();
		for(int i=0;i<list.size();i++){
			T obj = list.get(i);
			String mapKey = "";
			for(int j=0;j<mapKeyNames.length;j++){
				Object propValue = BeanUtil.getPropertyValue(mapKeyNames[j], obj);
				if(propValue == null){
					continue;
				}
				String key = ""+ propValue;
				if(StringUtils.isEmpty(key)){
					continue;
				}
				if(StringUtils.isEmpty(mapKey)){
					mapKey = key;
				}else{
					mapKey = mapKey+"_"+key;
				}
			}
			List<T> listT= null;
			if(!StringUtils.isEmpty(mapKey)){
				 listT= resultMap.get(mapKey);
			}
 			if(listT == null){
				listT = new ArrayList<T>();
			}
			listT.add(obj);
			if(!StringUtils.isEmpty(mapKey)){
				resultMap.put(mapKey, listT);
			}
 		}
		return resultMap;
	}
	
	public static <T> T copyNewSameProperty(Object source, Class<T> toClass,Object... ignores){
		T newBean = (T)BeanUtil.newInstance(toClass);
		BeanUtil.copySameProperty(source, newBean, ignores);
		return newBean;
	}

    public static  <T>  List<T>  copySamePropertyList(List sourceList,Class<T> toClass,Object... args){
		List<T>  newList = new ArrayList();
		for(int i=0;i<sourceList.size();i++){
			Object source = sourceList.get(i);
			T to = (T)BeanUtil.newInstance(toClass);
			BeanUtil.copySameProperty(source, to, args);
			newList.add(to);
		}
		return newList;
	}
  
	public static void copySamePropertyNotNull(Object source, Object to,Object... args) {
		if (source != null && to != null) {
			Field[] fields = getFields(source.getClass());
			for (int i = 0; i < fields.length; i++) {
				try {
					Field field = fields[i];
					String fieldName = field.getName();
					if (args != null && args.length > 0) {
						String ignore = (String) args[0];
						if (ignore != null && !"".equalsIgnoreCase(ignore.trim())) {
	 						if (ignore.indexOf(",") == -1) {
								if (ignore.equalsIgnoreCase(fieldName)) {
									continue;
								}
							} else {
								String[] ignores = ignore.split(",");
								boolean hasFind = false;
								for (int j = 0; j < ignores.length; j++) {
									if (ignores[j].equalsIgnoreCase(fieldName)) {
										hasFind = true;
										break;
									}
								}
								if (hasFind) {
									continue;
								}
							}
						}
					}
					String getMethodName = "get"
							+ fieldName.substring(0, 1).toUpperCase()
							+ fieldName.substring(1);
					String setMethodName = "set"
							+ fieldName.substring(0, 1).toUpperCase()
							+ fieldName.substring(1);
					try {
						// Method getMethod =
						// source.getClass().getDeclaredMethod(getMethodName,
						// null);
						Method getMethod = getMethod(source.getClass(),
								getMethodName);
						if (getMethod == null) {
							continue;
						}
						Object value = getMethod.invoke(source, null);
						if (value == null) {
							continue;
						}
						Class[] params = { field.getType() };
						Object[] obs = { value };
						// Method setMethod =
						// to.getClass().getDeclaredMethod(setMethodName,
						// params);
						Method setMethod = getMethod(to.getClass(),
								setMethodName);
						if (setMethod != null) {
							setMethod.invoke(to, obs);
						}
					} catch (InvocationTargetException e) {
						// pass
						throw new RuntimeException(e);
					}

				} catch (IllegalAccessException e) {
					// pass
					throw new RuntimeException(e);
				}
			}
		}
		/*
		 * try { BeanUtils.copyProperties(tobean, sourcebean); } catch
		 * (IllegalAccessException e) { throw new RuntimeException(e); } catch
		 * (InvocationTargetException e) { throw new RuntimeException(e); }
		 */
	}

	public static void copySameProperty(Object source, Object to,
			Object... args) {
		if (source != null && to != null) {
			Field[] fields = getFields(source.getClass());
			for (int i = 0; i < fields.length; i++) {
				Field field = fields[i];
				String fieldName = field.getName();
				if (args != null && args.length > 0) {
					String ignore = (String) args[0];
					if (ignore != null && !"".equalsIgnoreCase(ignore.trim())) {
 						if (ignore.indexOf(",") == -1) {
							if (ignore.equalsIgnoreCase(fieldName)) {
								continue;
							}
						} else {
							String[] ignores = ignore.split(",");
							boolean hasFind = false;
							for (int j = 0; j < ignores.length; j++) {
								if (ignores[j].equalsIgnoreCase(fieldName)) {
									hasFind = true;
									break;
								}
							}
							if (hasFind) {
								continue;
							}
						}
					}
				}
				String getMethodName = "get"
						+ fieldName.substring(0, 1).toUpperCase()
						+ fieldName.substring(1);
				String setMethodName = "set"
						+ fieldName.substring(0, 1).toUpperCase()
						+ fieldName.substring(1);
				try {
					// Method getMethod =
					// source.getClass().getDeclaredMethod(getMethodName,
					// null);
					Method getMethod = getMethod(source.getClass(),
							getMethodName);
					if (getMethod == null) {
						continue;
					}
					Object value = getMethod.invoke(source, null);
					Class[] params = { field.getType() };
					Object[] obs = { value };
					// Method setMethod =
					// to.getClass().getDeclaredMethod(setMethodName,
					// params);
					Method setMethod = getMethod(to.getClass(), setMethodName);
					if (setMethod != null) {
						setMethod.invoke(to, obs);
					}
				} catch (InvocationTargetException e) {
					// pass
					throw new RuntimeException("fieldName=" + fieldName
							+ ",copy error", e);
				} catch (IllegalAccessException e) {
					// pass
					throw new RuntimeException("fieldName=" + fieldName
							+ ",copy error", e);
				}catch(java.lang.IllegalArgumentException e){
					throw new RuntimeException("fieldName=" + fieldName
							+ ",copy error", e);
				}
			}
		}
	}
 

	public static boolean isEmpty(Object object, String ignore) {
		if (object == null) {
			return true;
		}
		if (object instanceof Map) {
			if (((Map) object).size() == 0) {
				return true;
			}
			Iterator keyIter = ((Map) object).keySet().iterator();
			while (keyIter.hasNext()) {
				Object key = keyIter.next();
				Object value = ((Map) object).get(key);
				if (value != null && !"".equals(value)) {
					boolean isIgnore = false;
					if (ignore != null && !"".equals(ignore)) {
						if (ignore.indexOf(",") != -1) {
							String[] ignores = ignore.split(",");
							for (int j = 0; j < ignores.length; j++) {
								if (ignores[j].equals(key)) {
									isIgnore = true;
									continue;
								}
							}
						} else {
							if (key.equals(ignore)) {
								isIgnore = true;
							}
						}
						if (isIgnore) {
							continue;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			}
			return true;
		}
		String className = object.getClass().getName();
		if (className.indexOf("$$EnhancerByCGLIB$$") != -1) {
			className = className.substring(0,
					className.indexOf("$$EnhancerByCGLIB$$"));
		}
		Field[] fields = getFields(BeanUtil.loadClass(className));
		boolean isEmpty = true;
		for (int i = 0; i < fields.length; i++) {
			try {
				Field field = fields[i];
				if (!field.isAccessible()) {
					field.setAccessible(true);
				}
				if (ignore != null && !"".equals(ignore)) {
					boolean isIgnore = false;
					if (ignore.indexOf(",") != -1) {
						String[] ignores = ignore.split(",");
						for (int j = 0; j < ignores.length; j++) {
							if (ignores[j].equals(field.getName())) {
								isIgnore = true;
								continue;
							}
						}
					} else {
						if (field.getName().equals(ignore)) {
							isIgnore = true;
							continue;
						}
					}
					if (isIgnore) {
						continue;
					}
				}
				if (field.getType().equals(List.class)) {
					continue;
				}
				if (!isPrimitiveType(field.getType())) {
					String fieldName = field.getName();
					String getMethodName = "get"
							+ fieldName.substring(0, 1).toUpperCase()
							+ fieldName.substring(1);
					String setMethodName = "set"
							+ fieldName.substring(0, 1).toUpperCase()
							+ fieldName.substring(1);
					try {
						Method getMethod = object.getClass().getDeclaredMethod(
								getMethodName, null);
						Object value = getMethod.invoke(object, null);
						if (value != null && !"".equals(value)) {
							if (value.getClass().getName()
									.indexOf("EnhancerByCGLIB") != -1
									|| !isEmpty(value, ignore)) {
								isEmpty = false;
								break;
							}
						}
					} catch (NoSuchMethodException e) {
					} catch (InvocationTargetException e) {
					}
				} else {
					Object value = field.get(object);
					if (value != null) {
						isEmpty = false;
						break;
					}
				}
			} catch (IllegalAccessException e) {
			}
		}
		return isEmpty;
	}

	public static String getSimpleName(Class clazz) {
		String name = clazz.getName();
		if (name.indexOf(".") == -1) {
			return name;
		}
		return name.substring(name.lastIndexOf(".") + 1);
	}

	public static List copyNewList(List list) {
		List newList = new ArrayList();
		if (list == null || list.size() == 0) {
			return newList;
		}
		for (int i = 0; i < list.size(); i++) {
			newList.add(list.get(i));
		}
		return newList;
	}

	public static void putAllFieldValue(Map contextMap, Object object) {
		Field[] fields = getFields(object.getClass());
		for (int i = 0; i < fields.length; i++) {
			try {
				fields[i].setAccessible(true);
				contextMap.put(fields[i].getName(), fields[i].get(object));
			} catch (IllegalArgumentException e) {
				throw new RuntimeException(e);
			} catch (IllegalAccessException e) {
				throw new RuntimeException(e);
			}
		}
	}

	public static String getClassName(Class klass) {
		String name = klass.getName();
		if (name.indexOf(".") != -1) {
			name = name.substring(name.lastIndexOf(".") + 1);
		}
		return name;
	}

	public static boolean hasField(Class clazz, String propertyName) {
		return getField(clazz, propertyName) != null;
	}

	public static Class getFieldType(Class clazz, String propertyName) {
		if (!hasField(clazz, propertyName)) {
			return null;
		}
		return getField(clazz, propertyName).getType();
	}

	public static Field getField(Class clazz, String propertyName) {
		Field[] fields = getFields(clazz);
		for (int i = 0; i < fields.length; i++) {
			Field field = fields[i];
			if (field.getName().equals(propertyName)) {
				return field;
			}
		}
		return null;
	}

	/**
	 * 得到class的所有属性
	 *
	 * @param clazz
	 * @return
	 */

	public static Field[] getFields(Class clazz) {
		String key = clazz.getName();
		if (fieldMap.containsKey(key)) {
			return (Field[]) fieldMap.get(key);
		} else {
			List<Field> fieldList = new ArrayList<Field>();
			while (!clazz.equals(Object.class)) {
				/**
				 * 包含超类的方法
				 */
				for (int i = 0; i < clazz.getDeclaredFields().length; i++) {
					fieldList.add(clazz.getDeclaredFields()[i]);
				}
				clazz = clazz.getSuperclass();
			}
			
			Field[] fields = new Field[fieldList.size()];
			for(int i=0;i<fieldList.size();i++){
				fields[i] = fieldList.get(i);
			}
			synchronized (fieldMap) {
				fieldMap.put(key, fields);
			}
			return fields;
		}

	}

	/**
	 * 得到bean的属性的字符串值，如果为null，转为''
	 *
	 * @param propertyName
	 * @param bean
	 * @return
	 */
	public final static String getStringValueIfNullToEmpty(String propertyName,
			Object bean) {
		Object value = getPropertyValue(propertyName, bean);
		if (value == null) {
			return "";
		} else {
			return String.valueOf(value);
		}
	}

	/**
	 * 初始化bean的非基本类型(容器,自定义类型)
	 *
	 * @param ob
	 * @param propertyName
	 */
	public static void initializeBeanProperty(Object ob, String propertyName) {
		Field field = getField(ob.getClass(), propertyName);
		if (field != null) {
			if (!isPrimitiveType(field.getType())) {
				field.setAccessible(false);
				Class klass = field.getType();
				if (klass.equals(List.class)) {
					setPropertyValue(ob, propertyName, new ArrayList());
					return;
				}
				if (klass.equals(ArrayList.class)) {
					setPropertyValue(ob, propertyName, new ArrayList());
					return;
				}
				if (klass.equals(LinkedList.class)) {
					setPropertyValue(ob, propertyName, new LinkedList());
					return;
				}
				if (klass.equals(Map.class)) {
					setPropertyValue(ob, propertyName, new HashMap());
					return;
				}
				if (klass.equals(HashMap.class)) {
					setPropertyValue(ob, propertyName, new HashMap());
					return;
				}
				if (klass.equals(Hashtable.class)) {
					setPropertyValue(ob, propertyName, new Hashtable());
					return;
				}
				try {
					/**
					 * 尝试默认构造函数初始化
					 */
					setPropertyValue(ob, propertyName, newInstance(klass));
				} catch (Exception e) {
					/**
					 * 检查构造函数
					 */
					Constructor[] constructors = klass
							.getDeclaredConstructors();
					if (constructors != null) {
						for (int i = 0; i < constructors.length; i++) {
							Constructor constructor = (Constructor) constructors[i];
							/**
							 * 尝试用第一个有权限的构造函数初始化
							 */
							if (constructor.isAccessible()) {
								try {
									setPropertyValue(ob, propertyName,
											constructor.newInstance(null));
									return;
								} catch (IllegalArgumentException e1) {
									throw new RuntimeException(e1);
								} catch (InstantiationException e1) {
									throw new RuntimeException(e1);
								} catch (IllegalAccessException e1) {
									throw new RuntimeException(e1);
								} catch (InvocationTargetException e1) {
									throw new RuntimeException(e1);
								}
							}
						}
					}
				}
			}
		}
	}

	public static void setPropertyValue(Object ob, String propertyName,
			Object propertyValue) {
		try {
			Field field = getField(ob.getClass(), propertyName);
			field.setAccessible(true);
			field.set(ob, propertyValue);
		} catch (SecurityException e) {
			throw new RuntimeException(e);
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e);
		}
	}

	public static List initializeList(Object[] properyValues, Class klass,
			String propertyName) {
		List list = new ArrayList();
		for (int i = 0; i < properyValues.length; i++) {
			Object bean = newInstance(klass);
			setPropertyValue(bean, propertyName, properyValues[i]);
			list.add(bean);
		}
		return list;
	}

	public static Object initialize(Object ob) {
		Method[] methods = getMethods(ob.getClass());
		for (int i = 0; i < methods.length; i++) {
			String methodName = methods[i].getName();
			if (methodName.startsWith("set")) {
				/**
				 * ok,标准的set函数
				 */
				Method setMethod = methods[i];
				Class[] klasss = setMethod.getParameterTypes();
				if (klasss.length == 1) {
					/**
					 * 长度为1才是默认set函数
					 */
					Class klass = klasss[0];
					Object[] params = new Object[1];
					if (String.class.equals(klass)) {
						params[0] = "A";
					} else if (Long.class.equals(klass)) {
						/**
						 * +i 是为了区分如果有两个Long类型的值
						 * eg:双主键，因为要插入数据库，所以不能简单的'0'，否则会出错
						 */
						params[0] = new Long(i);
						// params[0] = new Long(System.currentTimeMillis() + i);
					} else if (Date.class.equals(klass)) {
						params[0] = new Date();
					} else if (Integer.class.equals(klass)) {
						params[0] = new Integer(0);
					} else if (Double.class.equals(klass)) {
						params[0] = new Double(0);
					} else if (List.class.equals(klass)) {
						params[0] = new ArrayList(0);
					} else if (klass.getClass().getName()
							.equals("java.lang.Class")) {
						/**
						 * int等基本类型得到的class是java.lang.Class
						 */
						continue;
					} else {
						// params[0] = initialize(newInstance(klass));
						params[0] = newInstance(klass);
					}
					try {
						setMethod.invoke(ob, params);
					} catch (IllegalArgumentException e) {
						throw new RuntimeException(e);
					} catch (IllegalAccessException e) {
						throw new RuntimeException(e);
					} catch (InvocationTargetException e) {
						throw new RuntimeException(e);
					}
				}
			}
		}
		return ob;
	}

	private static Map methodMap = new HashMap();

	public static boolean hasMethod(Class clazz, String methodName) {
		return getMethod(clazz, methodName) != null;
	}

	public static boolean hasMethodIgnoreCase(Class clazz, String methodName) {
		return getMethodIgnoreCase(clazz, methodName) != null;
	}

	public static Method getMethodIgnoreCase(Class clazz, String methodName) {
		Method[] methods = getMethods(clazz);
		for (int i = 0; i < methods.length; i++) {
			Method method = methods[i];
			if (method.getName().equalsIgnoreCase(methodName)) {
				return method;
			}
		}
		return null;
	}

	public static Method getMethod(Class clazz, String methodName) {
		Method[] methods = getMethods(clazz);
		for (int i = 0; i < methods.length; i++) {
			Method method = methods[i];
			if (method.getName().equals(methodName)) {
				return method;
			}
		}
		return null;
	}

	public static List getMethods(Class clazz, String methodName) {
		Method[] methods = getMethods(clazz);
		List list = new ArrayList();
		for (int i = 0; i < methods.length; i++) {
			Method method = methods[i];
			if (method.getName().equals(methodName)) {
				list.add(method);
			}
		}
		return list;
	}

	public static Method[] getMethods(Class clazz) {
		/**
		 * clazz.getName() 是object ??
		 */
		String key = clazz.getName();
		if (methodMap.get(key) == null) {
			List methodList = new ArrayList();
			while (!clazz.equals(Object.class)) {
				/**
				 * 包含超类的方法
				 */
				for (int i = 0; i < clazz.getMethods().length; i++) {
					methodList.add(clazz.getMethods()[i]);
				}
				clazz = clazz.getSuperclass();
			}
			Method[] methods = new Method[methodList.size()];
			for (int i = 0; i < methodList.size(); i++) {
				methods[i] = (Method) methodList.get(i);
			}
			synchronized (methodMap) {
				methodMap.put(key, methods);
			}
		}
		return (Method[]) methodMap.get(key);
	}

	public static List getMethodNameList(Class clazz) {
		Method[] methods = getMethods(clazz);
		List nameList = new ArrayList();
		for (int i = 0; i < methods.length; i++) {
			nameList.add(methods[i].getName());
		}
		return nameList;
	}

	public static Object copy(Object source) {
		if (source == null) {
			return null;
		}
		Object to = null;
		try {
			to = source.getClass().newInstance();
		} catch (Exception e) {
			throw new RuntimeException("class[" + source.getClass().getName()
					+ " has'n no parameter constructor]");
		}
		Field[] fields = getFields(source.getClass());
		for (int i = 0; i < fields.length; i++) {

			try {
				Field field = fields[i];
				if (!field.isAccessible()) {
					field.setAccessible(true);
				}
				if (field.getModifiers() != Modifier.PRIVATE
						&& field.getModifiers() != Modifier.STATIC) {
					/**
					 * 非private
					 */
					Object value = field.get(source);
					if (value != null) {
						if (isPrimitiveType(value.getClass())) {
							field.set(to, value);
						} else {
							Object newValue = copy(value);
							field.set(to, newValue);
						}
					}
				} else {
					if (isPrimitiveType(field.getType())) {
						Object value = field.get(source);
						if (value != null) {
							field.set(to, value);
						}
					} else {
						/**
						 * 检查是否有get函数
						 */
						String fieldName = field.getName();
						String getMethodName = "get"
								+ fieldName.substring(0, 1).toUpperCase()
								+ fieldName.substring(1);
						String setMethodName = "set"
								+ fieldName.substring(0, 1).toUpperCase()
								+ fieldName.substring(1);
						try {
							Method getMethod = source.getClass()
									.getDeclaredMethod(getMethodName, null);
							Object value = getMethod.invoke(source, null);
							if (value == null) {
								continue;
							}
							Class[] params = { field.getType() };
							Object[] obs = new Object[0];
							if (isPrimitiveType(value.getClass())) {
								obs[0] = value;
							} else {
								obs[0] = copy(value);
							}
							Method setMethod = source.getClass()
									.getDeclaredMethod(setMethodName, params);
							setMethod.invoke(to, obs);
						} catch (NoSuchMethodException e) {
						} catch (InvocationTargetException e) {
						}
					}
				}

			} catch (IllegalAccessException e) {
			}
		}
		return to;
	}

	public static Object copyNotNull(Object source, Object to) {
		if (source != null && to != null) {
			if (!source.getClass().equals(to.getClass())) {
				throw new RuntimeException("copy的两个对象类型不一致,source("
						+ source.getClass() + "),to(" + to.getClass() + ")");
			}
			Field[] fields = getFields(source.getClass());
			for (int i = 0; i < fields.length; i++) {
				try {
					Field field = fields[i];
					if (!field.isAccessible()) {
						field.setAccessible(true);
					}
					if (field.getModifiers() != 2) {
						/**
						 * 非private
						 */
						Object value = field.get(source);
						if (value != null) {
							field.set(to, value);
						}
					} else {
						/**
						 * 检查是否有get函数
						 */
						if (isPrimitiveType(field.getType())) {
							Object value = field.get(source);
							if (value != null) {
								field.set(to, value);
							}
						} else {
							String fieldName = field.getName();
							String getMethodName = "get"
									+ fieldName.substring(0, 1).toUpperCase()
									+ fieldName.substring(1);
							String setMethodName = "set"
									+ fieldName.substring(0, 1).toUpperCase()
									+ fieldName.substring(1);
							try {
								Method getMethod = source.getClass()
										.getDeclaredMethod(getMethodName, null);
								Object value = getMethod.invoke(source, null);
								if (value != null) {
									Class[] params = { field.getType() };
									Object[] obs = { value };
									Method setMethod = source.getClass()
											.getDeclaredMethod(setMethodName,
													params);
									setMethod.invoke(to, obs);
								}
							} catch (NoSuchMethodException e) {
								// pass
							} catch (InvocationTargetException e) {
								// pass
							}
						}
					}

				} catch (IllegalAccessException e) {
					// pass
				}
			}
		}
		return to;
	}

	public static Object copyNotNullPrimitiveProperties(Object source, Object to) {
		if (source != null && to != null) {
			if (!source.getClass().equals(to.getClass())) {
				throw new RuntimeException("copy Error,source("
						+ source.getClass() + "),to(" + to.getClass() + ")");
			}
			Field[] fields = getFields(source.getClass());
			for (int i = 0; i < fields.length; i++) {
				try {
					Field field = fields[i];
					if (!field.isAccessible()) {
						field.setAccessible(true);
					}
					if (field.getModifiers() != 2) {

						Object value = field.get(source);
						if (value != null) {
							field.set(to, value);
						}
					} else {
						if (isPrimitiveType(field.getType())) {
							Object value = field.get(source);
							if (value != null) {
								field.set(to, value);
							}
						}
					}
				} catch (IllegalAccessException e) {
					// pass
				}
			}
		}
		return to;
	}

/*
	public static Class loadClass(String classpath) {
		try {
			return BeanUtil.class.getClassLoader().loadClass(classpath);
		} catch (ClassNotFoundException e) {
			throw new RuntimeException(e);
		}
	}*/
	public static Class loadClass(String classpath) {
		if(classMap.containsKey(classpath)){
			return classMap.get(classpath);
		}
		try {
			Class klass =  BeanUtil.class.getClassLoader().loadClass(classpath);
			classMap.put(classpath, klass);
			return klass;
		} catch (ClassNotFoundException e) {
			throw new RuntimeException(e);
		}
	}
	
	private static Map<String ,Class> classMap = new HashMap<String,Class>();

	public static Object newInstance(String clazz) {
		return newInstance(loadClass(clazz));
	}

	public static Object newInstance(Class clazz) {
		try {
			return clazz.newInstance();
		} catch (InstantiationException e) {
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e);
		}
	}

	public static void copy(Object source, Object to) {
		if (source != null && to != null) {
			if (!source.getClass().equals(to.getClass())) {
				if (!source.getClass().getName()
						.startsWith(to.getClass().getName())
						&& !to.getClass().getName()
								.startsWith(source.getClass().getName())) {
					throw new RuntimeException("copy的两个对象类型不一致,source("
							+ source.getClass() + "),to(" + to.getClass() + ")");
				}
			}
			Field[] fields = getFields(source.getClass());
			for (int i = 0; i < fields.length; i++) {
				try {
					Field field = fields[i];
					if (!field.isAccessible()) {
						field.setAccessible(true);
					}
					if (field.getModifiers() != 2) {
						/**
						 * 非private
						 */
						Object value = field.get(source);
						field.set(to, value);
					} else {
						/**
						 * 检查是否有get函数
						 */
						if (isPrimitiveType(field.getType())) {

							Object value = field.get(source);
							if (value != null) {
								field.set(to, value);
							}
						} else {
							String fieldName = field.getName();
							String getMethodName = "get"
									+ fieldName.substring(0, 1).toUpperCase()
									+ fieldName.substring(1);
							String setMethodName = "set"
									+ fieldName.substring(0, 1).toUpperCase()
									+ fieldName.substring(1);
							try {
								Method getMethod = source.getClass()
										.getDeclaredMethod(getMethodName, null);
								Object value = getMethod.invoke(source, null);

								Class[] params = { field.getType() };
								Object[] obs = { value };
								Method setMethod = source.getClass()
										.getDeclaredMethod(setMethodName,
												params);
								setMethod.invoke(to, obs);
							} catch (NoSuchMethodException e) {
								// pass\
								// throw new RuntimeException(e);
							} catch (InvocationTargetException e) {
								// pass
								throw new RuntimeException(e);
							}
						}
					}

				} catch (IllegalAccessException e) {
					// pass
					throw new RuntimeException(e);
				}
			}
		}
		/*
		 * try { BeanUtils.copyProperties(tobean, sourcebean); } catch
		 * (IllegalAccessException e) { throw new RuntimeException(e); } catch
		 * (InvocationTargetException e) { throw new RuntimeException(e); }
		 */
	}

	public static Object invoke(Method method, Object bean, Object[] params) {
		try {
			return method.invoke(bean, params);
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e);
		} catch (InvocationTargetException e) {
			throw new RuntimeException(e.getTargetException());
		}
	}

	public static Object invoke(Object bean, String methodName, Object[] params) {
		return invoke(getMethod(bean.getClass(), methodName), bean, params);
	}

	public static Object invokeIgnoreCase(Object bean, String methodName,
			Object[] params) {
		return invoke(getMethodIgnoreCase(bean.getClass(), methodName), bean,
				params);
	}

	public final static Object getPropertyValue(String propertyName, Object bean) {
		if (bean == null) {
			return null;
		}
		/**
		 * 检查有没有get方法
		 */
		String getMethodName = "get"
				+ propertyName.substring(0, 1).toUpperCase()
				+ propertyName.substring(1);
		List methods = getMethods(bean.getClass(), getMethodName);
		for (int i = 0; i < methods.size(); i++) {
			Method getMethod = (Method) methods.get(i);
			if (methods.size() == 1 || getMethod.getParameterTypes() == null
					|| getMethod.getParameterTypes().length == 0) {
				// 调用空参数方法
				try {
					return getMethod.invoke(bean, null);
				} catch (IllegalArgumentException e) {
					throw new RuntimeException(e);
				} catch (IllegalAccessException e) {
					throw new RuntimeException(e);
				} catch (InvocationTargetException e) {
					throw new RuntimeException(e);
				}
			}
		}

		try {
			Field field = getField(bean.getClass(), propertyName);
			if(field == null){
				return null;
			}
			if (!field.isAccessible()) {
				field.setAccessible(true);
			}
			return field.get(bean);
		} catch (SecurityException e) {
			throw new RuntimeException(e);
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean isPrimitiveType(Class clazz) {
		List list = new ArrayList();
		list.add(Boolean.class);
		list.add(Character.class);
		list.add(Byte.class);
		list.add(Short.class);
		list.add(Integer.class);
		list.add(Long.class);
		list.add(Float.class);
		list.add(Double.class);
		list.add(String.class);
		list.add(java.util.Date.class);
		list.add(java.sql.Date.class);
		if (list.contains(clazz)) {
			return true;
		} else {
			return false;
		}
	}
	
	/*
	 * public static String genDomainUniqueValue(Class<?> classz,String method){
	 * String uniqueValue = null; try { Method method1 = classz.getMethod(method,
	 * String.class); Class<?> superClass = classz.getSuperclass(); Method method2 =
	 * superClass.getMethod("exist"); Object newBean = BeanUtil.newInstance(classz);
	 * while(true){ uniqueValue = Util.getRndPlainText(10);
	 * method1.invoke(newBean,uniqueValue); if(!(boolean) method2.invoke(newBean)){
	 * break; } } } catch (NoSuchMethodException | SecurityException e) {
	 * e.printStackTrace(); } catch (IllegalAccessException e) {
	 * e.printStackTrace(); } catch (IllegalArgumentException e) {
	 * e.printStackTrace(); } catch (InvocationTargetException e) {
	 * e.printStackTrace(); } return uniqueValue; }
	 */

}