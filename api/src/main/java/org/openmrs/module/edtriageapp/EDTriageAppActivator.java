/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.edtriageapp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.ConceptName;
import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.module.BaseModuleActivator;
import org.openmrs.module.DaemonToken;
import org.openmrs.module.DaemonTokenAware;
import org.openmrs.module.ModuleActivator;
import org.openmrs.module.dataexchange.DataImporter;

import org.openmrs.module.edtriageapp.task.TriageTask;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * This class contains the logic that is run every time this module is either started or stopped.
 */
public class EDTriageAppActivator extends BaseModuleActivator implements DaemonTokenAware {
	
	ConceptService conceptService;
	
	AdministrationService adminService;
	
	protected Log log = LogFactory.getLog(getClass());
	
	/**
	 * @see ModuleActivator#started()
	 */
	public void started() {
		
		TriageTask.setEnabled(true);
		try {
			installConcepts();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		
		log.info("ED Triage App Module started");
	}
	
	/**
	 * @see ModuleActivator#stopped()
	 */
	public void stopped() {
		log.info("ED Triage App Module stopped");
	}
	
	@Override
	public void setDaemonToken(DaemonToken daemonToken) {
		TriageTask.setDaemonToken(daemonToken);
	}
	
	private void installConcepts() {
		
		GlobalProperty installedVersion = Context.getAdministrationService()
		        .getGlobalPropertyObject(EDTriageConstants.EDTRIAGE_VERSION_GP);
		
		if (installedVersion == null) {
			installedVersion = new GlobalProperty(EDTriageConstants.EDTRIAGE_VERSION_GP, "0");
		}
		
		if (Integer.valueOf(installedVersion.getPropertyValue()) < EDTriageConstants.EDTRIAGE_METADATA_VERSION) {
			Context.flushSession(); //Flush so that purges are not deferred until after data import	
			log.info("Started importing concepts");
			DataImporter dataImporter = Context.getRegisteredComponent("dataImporter", DataImporter.class);
			try {
				dataImporter.importData("ed_Triage_Concepts.xml");
				dataImporter.importData("encounter_type.xml");
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			
			log.info("finished ED metadata");
			
			//1.11 requires building the index for the newly added concepts.
			//Without doing so, cs.getConceptByClassName() will return an empty list.
			//We use reflection such that we do not blow up versions before 1.11
			try {
				Method method = Context.class.getMethod("updateSearchIndexForType", new Class[] { Class.class });
				method.invoke(null, new Object[] { ConceptName.class });
			}
			catch (NoSuchMethodException ex) {
				//this must be a version before 1.11
			}
			catch (InvocationTargetException ex) {
				log.error("Failed to update search index", ex);
			}
			catch (IllegalAccessException ex) {
				
				log.error("Failed to update search index", ex);
			}
			
			installedVersion.setPropertyValue(EDTriageConstants.EDTRIAGE_METADATA_VERSION.toString());
		}
		
		Context.getAdministrationService().saveGlobalProperty(installedVersion);
	}
}
