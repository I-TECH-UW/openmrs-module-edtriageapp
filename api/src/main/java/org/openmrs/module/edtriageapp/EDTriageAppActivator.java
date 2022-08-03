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
import org.openmrs.Concept;

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
		

		log.info("ED Triage App Module started");
	}
	
	private List<Initializer> getInitializers() {
		List<Initializer> l = new ArrayList<Initializer>();
		l.add(new ConceptsInitializer());
	
		return l;
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
