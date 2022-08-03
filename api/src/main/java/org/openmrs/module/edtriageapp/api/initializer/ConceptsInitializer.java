package org.openmrs.module.edtriageapp.api.initializer;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.openmrs.ConceptName;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.GlobalProperty;
import org.openmrs.api.context.Context;
import org.openmrs.module.dataexchange.DataImporter;
import org.openmrs.module.edtriageapp.EDTriageConstants;
import org.springframework.beans.factory.annotation.Autowired;

public class ConceptsInitializer  implements Initializer{
	
	    protected Log log = LogFactory.getLog(getClass());
	    

		private void installConcepts() {
			GlobalProperty installedVersion = Context.getAdministrationService().getGlobalPropertyObject(
			   EDTriageConstants.EDTRIAGE_VERSION_GP);
			
			if (installedVersion == null) {
				installedVersion = new GlobalProperty(EDTriageConstants.EDTRIAGE_VERSION_GP, "0");
			}
			
			if (Integer.valueOf(installedVersion.getPropertyValue()) <EDTriageConstants.EDTRIAGE_METADATA_VERSION) {
				
				Context.flushSession(); //Flush so that purges are not deferred until after data import
				log.info("Started importing concepts........................................");
				DataImporter dataImporter = Context.getRegisteredComponent("dataImporter", DataImporter.class);
				
				try {
					dataImporter.importData("ed_Triage_Concepts.xml");
				
				}
				catch (Exception e) {
					e.printStackTrace();
					//System.out.print(e.toString());
				}
				
				log.info("finished importing concepts........................................");
				
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



	@Override
	public void started() {
		// TODO Auto-generated method stub
		
		installConcepts();
		
	}

	@Override
	public void stopped() {
		// TODO Auto-generated method stub
		
	}
	


}
