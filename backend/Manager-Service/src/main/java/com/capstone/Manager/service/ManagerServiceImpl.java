package com.capstone.Manager.service;

import com.capstone.Manager.model.Manager;
import com.capstone.Manager.model.RequestStatus;
import com.capstone.Manager.model.Requests;
import com.capstone.Manager.repository.ManagerRepository;
import com.capstone.Manager.repository.RequestsRepository;
import com.capstone.Manager.util.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ManagerServiceImpl implements ManagerService{
    @Autowired
    ManagerRepository managerRepository;
    @Autowired
    RequestsRepository requestsRepository;
    @Autowired
    private EmailUtil emailUtil;
    public Manager saveManager(Manager manager) {
        for(Manager s:managerRepository.findAll()){
            if(s.getManageremail().equalsIgnoreCase(manager.getManageremail())){
                throw new RuntimeException("Can't add Manager");
            }
        }
        manager.setCreatedRequests(null);
//        String managerName = manager.getManagerName();
//
//        String subject = "You Have Been Registered By Admin Successfully";
//        String body = "<html>"
//                + "<body>"
//                + "<p>Hello <strong>" + managerName + "</strong>,</p>"
//                + "<p>Welcome to Platform ! Your default password is:</p>"
//                + "<p><strong>USTManager@123</strong></p>"
//                + "<p>For your security, please reset your password by clicking the link below:</p>"
//                + "<p><a href='https://ust.com' style='color: #007BFF;'>Reset your password</a></p>"
//                + "<p>If you have any issues, feel free to contact us.</p>"
//                + "<br>"
//                + "<p>Best regards,</p>"
//                + "<p>The Admin Team</p>"
//                + "</body>"
//                + "</html>";
//
//        emailUtil.sendEmail(manager.getManageremail(), subject, body);
        return managerRepository.save(manager);
    }
    public List<Manager> GetAllManagers() {
        List<Manager> managers=managerRepository.findAll();
        return managers;
    }

    public int getManagerByemail(String email){
        for(Manager m:GetAllManagers()){
            if(m.getManageremail()==null){
                continue;
            }
            if(m.getManageremail().equalsIgnoreCase(email)){
                return m.getManagerId();
            }
        }
        throw new RuntimeException("Manager Not FOund with Id");
    }

    public Manager GetManagerById(int id) {
        return managerRepository.findById(id).orElseThrow(()->new RuntimeException("Manager Not Found BY Id"));
    }

    public List<Manager> GetManagersbyAccountType(String name) {
        List<Manager> managers=managerRepository.findByAccountName(name);
        return managers;
    }

    public List<Manager> GetManagersbyName(String name) {
        List<Manager> managers=managerRepository.findByManagerName(name);
        return managers;
    }

    public void deleteManagerbyId(int id) {
        if(managerRepository.existsById(id)){
            managerRepository.deleteById(id);
        }
        else{
            throw new RuntimeException("Manager Not Found By Id");
        }
    }

    public Manager updateManager(int id, Manager managerdto) {
        if (managerRepository.existsById(id)) {
            Manager manager = managerRepository.findById(id).orElse(null);
            manager.setManagerName(managerdto.getManagerName());
            manager.setAccountType(managerdto.getAccountType());
//            manager.setCreatedRequests(managerdto.createdRequests());
            return managerRepository.save(manager);
        }
        throw new RuntimeException("Manager Not Found By Id");
    }

    public Requests saveRequest(Requests requestsdto) {
        if(!managerRepository.existsById(requestsdto.getManagerId())){
            throw new RuntimeException("Manager Not Found with this id");
        }
        Manager manager=managerRepository.findById(requestsdto.getManagerId()).orElse(null);
        requestsdto.setStatus(RequestStatus.PENDING);
        requestsdto.setAdminMessage("");
        requestsdto.setAdminName("");
        requestsdto.setManagerId(manager.getManagerId());
        requestsdto.setManagerName(manager.getManagerName());
        requestsdto.setAccountType(manager.getAccountType());
        List<Requests> requests1=manager.getCreatedRequests();
        requestsdto.setManager(manager);
        if(requests1!=null){
            requests1.add(requestsdto);
        }else {
            requests1=new ArrayList<>();
            requests1.add(requestsdto);
        }
        manager.setCreatedRequests(requests1);
        managerRepository.save(manager);
        return requestsRepository.save(requestsdto);
    }

    public List<Requests> getAllRequest() {
        return requestsRepository.findAll();
    }

    public List<Requests> getRequestByStatus(RequestStatus requestStatus) {
        return requestsRepository.findRequestsByStatus(requestStatus);
    }

    public Requests getRequestById(int id) {
        return requestsRepository.findById(id).orElseThrow(()->new RuntimeException("Request Not Found By Id"));
    }

    public void deleteRequestById(int id) {
        if(requestsRepository.existsById(id)) {
            requestsRepository.deleteById(id);
        }
        else {
            throw new RuntimeException("Request Not Found By Id");
        }
    }

    @Override
    public Requests UpdateRequestAdmin(int id, RequestStatus requestStatus, String msg,String MaintainerName) {
        Requests requestsdto=getRequestById(id);
        requestsdto.setStatus(requestStatus);
        requestsdto.setAdminMessage(msg);
        requestsdto.setAdminName(MaintainerName);
        return requestsRepository.save(requestsdto);
    }
}
