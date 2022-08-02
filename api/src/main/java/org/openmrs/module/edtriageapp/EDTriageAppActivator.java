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


import java.lang.reflect.InvocationTargetException;

import org.apache.commons.logging.Log;

import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.ConceptName;
import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.module.BaseModuleActivator;
import org.openmrs.module.DaemonToken;
import org.openmrs.module.DaemonTokenAware;
import org.openmrs.module.ModuleActivator;
import org.openmrs.module.edtriageapp.api.initializer.ConceptsInitializer;
import org.openmrs.module.edtriageapp.api.initializer.Initializer;
import org.openmrs.module.edtriageapp.task.TriageTask;
import org.openmrs.module.dataexchange.DataImporter;


import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;


/**
 * This class contains the logic that is run every time this module is either started or stopped.
 */
public class EDTriageAppActivator extends BaseModuleActivator implements DaemonTokenAware{
	ConceptService conceptService;
	AdministrationService adminService;
	
	protected Log log = LogFactory.getLog(getClass());
  
	/**
	 * @see ModuleActivator#started()
	 */
	public void started() {
		TriageTask.setEnabled(true);
		try {
			
			for (Initializer initializer : getInitializers()) {
				initializer.started();
			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			
		}
		
		setConceptsSetGp();
		log.info("ED Triage App Module started");
	}
	
	private List<Initializer> getInitializers() {
		List<Initializer> l = new ArrayList<Initializer>();
		l.add(new ConceptsInitializer());
	
		return l;
	}
	
	public void setConceptsSetGp() {
		adminService = Context.getAdministrationService();
		conceptService = Context.getConceptService();
		try {
			Concept triageSet = conceptService.getConceptByName(EDTriageConstants.TRIAGE_CONCEPT_SET_OF_SETS);
			adminService.setGlobalProperty(EDTriageConstants.TRIAGE_SET_GP, triageSet.getUuid());
		}
		catch (Exception e) {
			log.info("failed to set Concept_set Global Property");
		}
		
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
}
