from .models import User, change_work_group_request, sub_team_owner, subTeam
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
# from rest_framework.pagination import PaginationSerializer

class sub_team_serializer(serializers.ModelSerializer):

    class Meta:
        model = subTeam
        fields = '__all__'

class permission_serializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = '__all__'

class group_serializer(serializers.ModelSerializer):

    permissions = permission_serializer(read_only=True, many=True)

    class Meta:
        model = Group
        fields = '__all__'


class user_serializer(serializers.ModelSerializer):

    team_name = serializers.SerializerMethodField(read_only=True)
    sub_team_name = serializers.SerializerMethodField(read_only=True)
    role_name = serializers.SerializerMethodField(read_only=True)
    groups = group_serializer(read_only=True, many=True)
   
    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'email', 'team', 'team_name','sub_team', 'sub_team_name', 'role', 'role_name', 'is_active', 'is_block', 'groups')
        read_only_fields = ('id', 'username', 'first_name', 'last_name', 'email')

    def get_sub_team_name(self, obj):

        if obj.sub_team == None:
            return ""

        return obj.sub_team.name
    
    def get_team_name(self, obj):

        if obj.team == None:
            return ""

        return obj.team.name

    def get_role_name(self, obj):

        if obj.role == None:
            return ""

        return obj.role.name

class simple_user_serializer(serializers.ModelSerializer):

    team_name = serializers.ReadOnlyField(source='team.name')
    sub_team_name = serializers.ReadOnlyField(source='sub_team.name')
    role_name = serializers.ReadOnlyField(source='role.name')

    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'email', 'team', 'team_name','sub_team', 'sub_team_name', 'role', 'role_name')

class work_group_request_serializer(serializers.ModelSerializer):

    requested_by = simple_user_serializer(read_only=True)
    user = simple_user_serializer(read_only=True)
    source = serializers.ReadOnlyField(source='source.name')
    target = serializers.ReadOnlyField(source='target.name')

    class Meta:
        model = change_work_group_request
        fields = "__all__"

class sub_team_owner_serializers(serializers.ModelSerializer):

    user_info = serializers.SerializerMethodField(read_only=True)
    work_group = serializers.SerializerMethodField(read_only=True)
    team = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = sub_team_owner
        fields = ("id","sub_team", "work_group", "owner", "user_info", "team")
        read_only_fields = ("user_info", )

    def get_user_info(self, obj):
        user_info = []
        if obj.owner.count() != 0:
            for user in obj.owner.all():
                user_info.append({"name":user.get_full_name(), "username":user.username})
        return user_info

    def get_work_group(self, obj):

        if obj.sub_team == None:
            return "NA"

        return obj.sub_team.name
    
    def get_team(self, obj):

        if obj.sub_team == None:
            return "NA"

        return obj.sub_team.team.name