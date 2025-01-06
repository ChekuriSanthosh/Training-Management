package com.capstone.Manager.service;

import com.capstone.Manager.model.Manager;
import com.capstone.Manager.model.RequestStatus;
import com.capstone.Manager.model.Requests;

import java.util.List;

public interface ManagerService {

    public Manager saveManager(Manager manager);
    public List<Manager> GetAllManagers();
    public Manager GetManagerById(int id);
    public List<Manager> GetManagersbyAccountType(String name);
    public List<Manager> GetManagersbyName(String name);
    public int getManagerByemail(String email);

    public void deleteManagerbyId(int id);
    public Manager updateManager(int id, Manager managerdto);

    public Requests saveRequest(Requests requestsdto);
    public List<Requests> getAllRequest();
    public List<Requests> getRequestByStatus(RequestStatus requestStatus);
    public Requests getRequestById(int id);
    public void deleteRequestById(int id);
    public Requests UpdateRequestAdmin(int id, RequestStatus requestStatus, String msg,String MaintainerName);
}
